<template>
  <BaseCard class="w-full max-w-2xl">
    <template #header>
      <h2 class="text-lg font-semibold text-gray-900">
        {{ isEditing ? 'Edit Goal' : 'Set Calorie Goal' }}
      </h2>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Daily Calories -->
      <BaseInput
        v-model="form.dailyCalories"
        label="Daily Calorie Goal"
        type="number"
        min="800"
        max="5000"
        step="50"
        placeholder="2000"
        required
        :error="errors.dailyCalories"
        hint="Recommended range: 1200-3000 calories per day"
      />

      <!-- Goal Type -->
      <BaseSelect v-model="form.goal" label="Goal Type" required :error="errors.goal">
        <option value="lose-weight">Lose Weight</option>
        <option value="maintain-weight">Maintain Weight</option>
        <option value="gain-weight">Gain Weight</option>
      </BaseSelect>

      <!-- Activity Level -->
      <BaseSelect
        v-model="form.activityLevel"
        label="Activity Level"
        required
        :error="errors.activityLevel"
        hint="This helps calculate your daily calorie needs"
      >
        <option value="sedentary">Sedentary (Little to no exercise)</option>
        <option value="lightly-active">Lightly Active (1-3 days/week)</option>
        <option value="moderately-active">Moderately Active (3-5 days/week)</option>
        <option value="very-active">Very Active (6-7 days/week)</option>
        <option value="extremely-active">Extremely Active (2x/day or intense exercise)</option>
      </BaseSelect>

      <!-- Macronutrient Goals -->
      <div class="space-y-4">
        <h3 class="text-md font-medium text-gray-900">Macronutrient Goals (Optional)</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseInput
            v-model="form.protein"
            label="Protein (g)"
            type="number"
            min="0"
            step="5"
            placeholder="150"
            :error="errors.protein"
            hint="0.8-1.2g per kg body weight"
          />

          <BaseInput
            v-model="form.carbs"
            label="Carbs (g)"
            type="number"
            min="0"
            step="5"
            placeholder="250"
            :error="errors.carbs"
            hint="45-65% of total calories"
          />

          <BaseInput
            v-model="form.fat"
            label="Fat (g)"
            type="number"
            min="0"
            step="5"
            placeholder="67"
            :error="errors.fat"
            hint="20-35% of total calories"
          />
        </div>
      </div>

      <!-- Calorie Calculator -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <h3 class="text-md font-medium text-gray-900 mb-3">Calorie Calculator</h3>
        <p class="text-sm text-gray-600 mb-4">Get a personalized calorie recommendation based on your profile</p>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <BaseInput
            v-model="calculator.weight"
            label="Weight (kg)"
            type="number"
            min="30"
            max="300"
            step="0.5"
            placeholder="70"
          />

          <BaseInput
            v-model="calculator.height"
            label="Height (cm)"
            type="number"
            min="100"
            max="250"
            placeholder="170"
          />

          <BaseInput v-model="calculator.age" label="Age" type="number" min="16" max="120" placeholder="25" />

          <BaseSelect v-model="calculator.sex" label="Sex" placeholder="Select sex">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </BaseSelect>
        </div>

        <div class="flex justify-between items-center">
          <BaseButton type="button" variant="secondary" @click="calculateCalories" :disabled="!canCalculate">
            Calculate Recommended Calories
          </BaseButton>

          <div v-if="recommendedCalories" class="text-sm text-gray-600">
            Recommended: <span class="font-semibold">{{ recommendedCalories }}</span> calories/day
          </div>
        </div>
      </div>

      <!-- Macro Percentage Guide -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-md font-medium text-gray-900 mb-3">Macro Distribution Guide</h3>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Protein ({{ proteinPercentage }}%)</span>
            <span class="font-medium">{{ form.protein || 0 }}g ({{ proteinCalories }} cal)</span>
          </div>
          <div class="flex justify-between">
            <span>Carbs ({{ carbsPercentage }}%)</span>
            <span class="font-medium">{{ form.carbs || 0 }}g ({{ carbsCalories }} cal)</span>
          </div>
          <div class="flex justify-between">
            <span>Fat ({{ fatPercentage }}%)</span>
            <span class="font-medium">{{ form.fat || 0 }}g ({{ fatCalories }} cal)</span>
          </div>
          <div class="border-t pt-2 mt-2 font-medium">
            <div class="flex justify-between">
              <span>Total Macros</span>
              <span>{{ totalMacroCalories }} cal</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Preset Buttons -->
      <div class="space-y-3">
        <h3 class="text-md font-medium text-gray-900">Quick Presets</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <BaseButton type="button" variant="secondary" size="sm" @click="applyPreset('balanced')">
            Balanced (40/30/30)
          </BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="applyPreset('low-carb')">
            Low Carb (30/20/50)
          </BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="applyPreset('high-protein')">
            High Protein (35/35/30)
          </BaseButton>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4">
        <BaseButton variant="secondary" @click="$emit('cancel')" type="button"> Cancel </BaseButton>
        <BaseButton type="submit" :disabled="!canSubmit" :loading="isSubmitting">
          {{ isEditing ? 'Update Goal' : 'Set Goal' }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CalorieGoal, CreateCalorieGoalInput, UpdateCalorieGoalInput } from '../_types/calorie';
import { CreateCalorieGoalSchema, UpdateCalorieGoalSchema } from '../_types/calorie';
import { calculateBMR, calculateTDEE, calculateCalorieGoal } from '../_utils/calorie-helpers';

interface Props {
  goal?: CalorieGoal;
  isEditing?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  submit: [data: CreateCalorieGoalInput | UpdateCalorieGoalInput];
  cancel: [];
}>();

// Form state
const form = ref({
  dailyCalories: 2000,
  protein: 150,
  carbs: 250,
  fat: 67,
  activityLevel: 'moderately-active',
  goal: 'maintain-weight',
  isActive: true,
});

// Calculator state
const calculator = ref({
  weight: 70,
  height: 170,
  age: 25,
  sex: 'male',
});

const recommendedCalories = ref<number | null>(null);

// Validation state
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

// Initialize form
onMounted(() => {
  if (props.isEditing && props.goal) {
    form.value = {
      dailyCalories: props.goal.dailyCalories,
      protein: props.goal.protein || 150,
      carbs: props.goal.carbs || 250,
      fat: props.goal.fat || 67,
      activityLevel: props.goal.activityLevel,
      goal: props.goal.goal,
      isActive: props.goal.isActive,
    };
  }
});

// Computed properties
const canCalculate = computed(() => {
  return calculator.value.weight > 0 && calculator.value.height > 0 && calculator.value.age > 0 && calculator.value.sex;
});

const canSubmit = computed(() => {
  return (
    form.value.dailyCalories >= 800 &&
    form.value.dailyCalories <= 5000 &&
    form.value.activityLevel &&
    form.value.goal &&
    !isSubmitting.value
  );
});

// Macro calculations
const proteinCalories = computed(() => (form.value.protein || 0) * 4);
const carbsCalories = computed(() => (form.value.carbs || 0) * 4);
const fatCalories = computed(() => (form.value.fat || 0) * 9);
const totalMacroCalories = computed(() => proteinCalories.value + carbsCalories.value + fatCalories.value);

const proteinPercentage = computed(() => {
  if (form.value.dailyCalories === 0) return 0;
  return Math.round((proteinCalories.value / form.value.dailyCalories) * 100);
});

const carbsPercentage = computed(() => {
  if (form.value.dailyCalories === 0) return 0;
  return Math.round((carbsCalories.value / form.value.dailyCalories) * 100);
});

const fatPercentage = computed(() => {
  if (form.value.dailyCalories === 0) return 0;
  return Math.round((fatCalories.value / form.value.dailyCalories) * 100);
});

// Methods
const calculateCalories = () => {
  if (!canCalculate.value) return;

  const bmr = calculateBMR(
    calculator.value.weight,
    calculator.value.height,
    calculator.value.age,
    calculator.value.sex as 'male' | 'female'
  );

  const tdee = calculateTDEE(bmr, form.value.activityLevel as any);
  const goalCalories = calculateCalorieGoal(tdee, form.value.goal as any);

  recommendedCalories.value = goalCalories;
  form.value.dailyCalories = goalCalories;
};

const applyPreset = (preset: 'balanced' | 'low-carb' | 'high-protein') => {
  const calories = form.value.dailyCalories;

  switch (preset) {
    case 'balanced': // 40% carbs, 30% protein, 30% fat
      form.value.carbs = Math.round((calories * 0.4) / 4);
      form.value.protein = Math.round((calories * 0.3) / 4);
      form.value.fat = Math.round((calories * 0.3) / 9);
      break;

    case 'low-carb': // 20% carbs, 30% protein, 50% fat
      form.value.carbs = Math.round((calories * 0.2) / 4);
      form.value.protein = Math.round((calories * 0.3) / 4);
      form.value.fat = Math.round((calories * 0.5) / 9);
      break;

    case 'high-protein': // 35% carbs, 35% protein, 30% fat
      form.value.carbs = Math.round((calories * 0.35) / 4);
      form.value.protein = Math.round((calories * 0.35) / 4);
      form.value.fat = Math.round((calories * 0.3) / 9);
      break;
  }
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.dailyCalories || form.value.dailyCalories < 800 || form.value.dailyCalories > 5000) {
    errors.value.dailyCalories = 'Daily calories must be between 800 and 5000';
  }

  if (!form.value.activityLevel) {
    errors.value.activityLevel = 'Please select an activity level';
  }

  if (!form.value.goal) {
    errors.value.goal = 'Please select a goal type';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const goalData = {
      dailyCalories: Number(form.value.dailyCalories),
      protein: form.value.protein ? Number(form.value.protein) : undefined,
      carbs: form.value.carbs ? Number(form.value.carbs) : undefined,
      fat: form.value.fat ? Number(form.value.fat) : undefined,
      activityLevel: form.value.activityLevel as any,
      goal: form.value.goal as any,
      isActive: form.value.isActive,
    };

    // Validate with Zod
    if (props.isEditing) {
      UpdateCalorieGoalSchema.parse(goalData);
    } else {
      CreateCalorieGoalSchema.parse(goalData);
    }

    emit('submit', goalData);
  } catch (error) {
    console.error('Form submission error:', error);
    if (error instanceof Error) {
      errors.value.submit = error.message;
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

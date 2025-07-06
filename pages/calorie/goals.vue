<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Calorie Goals</h1>
        <p class="text-gray-600">Set and manage your daily calorie and nutrition goals</p>
      </div>

      <!-- Current Goal -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Current Goal</h2>

        <div v-if="activeGoal" class="bg-white border border-gray-200 rounded-lg p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ activeGoal.dailyCalories }} calories/day</h3>
              <p class="text-sm text-gray-600">
                {{ formatGoalType(activeGoal.goal) }} • {{ formatActivityLevel(activeGoal.activityLevel) }}
              </p>
            </div>
            <div class="flex space-x-2">
              <BaseButton variant="secondary" size="sm" @click="editActiveGoal">
                <Icon name="heroicons:pencil" class="w-4 h-4 mr-1" />
                Edit
              </BaseButton>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ activeGoal.protein || 0 }}g</div>
              <div class="text-sm text-gray-600">Protein</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ activeGoal.carbs || 0 }}g</div>
              <div class="text-sm text-gray-600">Carbs</div>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <div class="text-2xl font-bold text-yellow-600">{{ activeGoal.fat || 0 }}g</div>
              <div class="text-sm text-gray-600">Fat</div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Icon name="heroicons:target" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Active Goal</h3>
          <p class="text-gray-600 mb-6">Set your first calorie goal to start tracking your progress.</p>
          <BaseButton @click="showAddForm = true">
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Set Goal
          </BaseButton>
        </div>
      </div>

      <!-- Goal History -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Goal History</h2>
          <BaseButton variant="secondary" @click="showAddForm = true">
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Add New Goal
          </BaseButton>
        </div>

        <div v-if="allGoals.length > 0" class="space-y-4">
          <div v-for="goal in allGoals" :key="goal.id" class="bg-white border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="font-medium text-gray-900">{{ goal.dailyCalories }} calories/day</h3>
                  <BaseBadge :variant="goal.isActive ? 'success' : 'default'">
                    {{ goal.isActive ? 'Active' : 'Inactive' }}
                  </BaseBadge>
                </div>
                <p class="text-sm text-gray-600 mb-2">
                  {{ formatGoalType(goal.goal) }} • {{ formatActivityLevel(goal.activityLevel) }}
                </p>
                <div class="flex space-x-4 text-sm text-gray-500">
                  <span>Protein: {{ goal.protein || 0 }}g</span>
                  <span>Carbs: {{ goal.carbs || 0 }}g</span>
                  <span>Fat: {{ goal.fat || 0 }}g</span>
                </div>
                <p class="text-xs text-gray-400 mt-2">Created: {{ formatDate(goal.createdAt) }}</p>
              </div>

              <div class="flex space-x-2">
                <BaseButton variant="secondary" size="sm" @click="editGoal(goal)">
                  <Icon name="heroicons:pencil" class="w-4 h-4" />
                </BaseButton>
                <BaseButton variant="destructive" size="sm" @click="deleteGoal(goal.id)" :disabled="goal.isActive">
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Icon name="heroicons:clock" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Goals Yet</h3>
          <p class="text-gray-600">Your goal history will appear here once you create your first goal.</p>
        </div>
      </div>

      <!-- Add Goal Modal -->
      <div
        v-if="showAddForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="showAddForm = false"
      >
        <div @click.stop class="w-full max-w-4xl max-h-screen overflow-y-auto">
          <CalorieGoalSettings @submit="handleAdd" @cancel="showAddForm = false" />
        </div>
      </div>

      <!-- Edit Goal Modal -->
      <div
        v-if="showEditForm && editingGoal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="showEditForm = false"
      >
        <div @click.stop class="w-full max-w-4xl max-h-screen overflow-y-auto">
          <CalorieGoalSettings
            :goal="editingGoal"
            :is-editing="true"
            @submit="handleUpdate"
            @cancel="showEditForm = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CalorieGoal, CreateCalorieGoalInput, UpdateCalorieGoalInput } from '../../modules/calorie/_types/calorie';
import { useCalorieManager } from '../../modules/calorie/_composables/use-calorie-manager';
import CalorieGoalSettings from '../../modules/calorie/_components/CalorieGoalSettings.vue';

// Set page meta
definePageMeta({
  title: 'Calorie Goals',
  description: 'Set and manage your daily calorie and nutrition goals',
});

useHead({
  title: 'Calorie Goals - Set Your Nutrition Targets',
  meta: [
    {
      name: 'description',
      content:
        'Set your daily calorie goals, track your nutrition targets, and monitor your progress towards a healthier lifestyle.',
    },
  ],
});

const { initialize, calorieGoals, getActiveGoal, setGoal, updateGoal, clearAllData } = useCalorieManager();

// Component state
const showAddForm = ref(false);
const showEditForm = ref(false);
const editingGoal = ref<CalorieGoal | null>(null);

// Computed properties
const activeGoal = computed(() => getActiveGoal());
const allGoals = computed(() =>
  calorieGoals.value.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
);

// Methods
const handleAdd = async (data: CreateCalorieGoalInput | UpdateCalorieGoalInput) => {
  try {
    await setGoal(data as CreateCalorieGoalInput);
    showAddForm.value = false;
  } catch (error) {
    console.error('Failed to add goal:', error);
    // You could show a toast notification here
  }
};

const editActiveGoal = () => {
  const goal = getActiveGoal();
  if (goal) {
    editingGoal.value = goal;
    showEditForm.value = true;
  }
};

const editGoal = (goal: CalorieGoal) => {
  editingGoal.value = goal;
  showEditForm.value = true;
};

const handleUpdate = async (data: CreateCalorieGoalInput | UpdateCalorieGoalInput) => {
  if (!editingGoal.value) return;

  try {
    await updateGoal(editingGoal.value.id, data as UpdateCalorieGoalInput);
    showEditForm.value = false;
    editingGoal.value = null;
  } catch (error) {
    console.error('Failed to update goal:', error);
    // You could show a toast notification here
  }
};

const deleteGoal = async (goalId: string) => {
  if (confirm('Are you sure you want to delete this goal?')) {
    try {
      // Implementation would be added to the manager
      // await deleteGoal(goalId)
      console.log('Delete goal:', goalId);
    } catch (error) {
      console.error('Failed to delete goal:', error);
      // You could show a toast notification here
    }
  }
};

const formatGoalType = (goal: string): string => {
  const types = {
    'lose-weight': 'Lose Weight',
    'maintain-weight': 'Maintain Weight',
    'gain-weight': 'Gain Weight',
  };
  return types[goal as keyof typeof types] || goal;
};

const formatActivityLevel = (level: string): string => {
  const levels = {
    sedentary: 'Sedentary',
    'lightly-active': 'Lightly Active',
    'moderately-active': 'Moderately Active',
    'very-active': 'Very Active',
    'extremely-active': 'Extremely Active',
  };
  return levels[level as keyof typeof levels] || level;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Initialize
onMounted(async () => {
  await initialize();
});
</script>

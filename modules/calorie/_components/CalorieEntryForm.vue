<template>
  <BaseCard class="w-full max-w-md">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">
        {{ isEditing ? 'Edit Entry' : 'Add Calorie Entry' }}
      </h3>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Food Search/Selection -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">
          Food Item *
        </label>
        <div class="relative">
          <BaseInput
            v-model="searchQuery"
            placeholder="Search for food..."
            @input="onFoodSearch"
            @focus="showFoodList = true"
            :error="errors.foodId"
            :disabled="!isInitialized()"
          />
          
          <!-- Food Search Results -->
          <div 
            v-if="showFoodList && (filteredFoods.length > 0 || searchQuery.length > 0)"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            <div 
              v-if="filteredFoods.length === 0 && searchQuery.length > 0"
              class="p-3 text-sm text-gray-500 text-center"
            >
              No foods found. <button type="button" @click="showAddFoodModal = true" class="text-blue-600 hover:text-blue-800">Add custom food</button>
            </div>
            
            <div
              v-for="food in filteredFoods"
              :key="food.id"
              @click="selectFood(food)"
              class="p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-medium text-gray-900">{{ food.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ food.brand }} • {{ food.category }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ food.nutrition.calories }} cal per {{ food.servingSize }}{{ food.servingUnit }}
                  </div>
                </div>
                <BaseBadge :variant="food.isCustom ? 'secondary' : 'default'">
                  {{ food.isCustom ? 'Custom' : 'Standard' }}
                </BaseBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Food Display -->
      <div v-if="selectedFood" class="p-3 bg-blue-50 rounded-md">
        <div class="flex justify-between items-start">
          <div>
            <div class="font-medium text-gray-900">{{ selectedFood.name }}</div>
            <div class="text-sm text-gray-600">
              {{ selectedFood.nutrition.calories }} cal per {{ selectedFood.servingSize }}{{ selectedFood.servingUnit }}
            </div>
          </div>
          <button
            type="button"
            @click="clearSelectedFood"
            class="text-gray-400 hover:text-gray-600"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Quantity -->
      <BaseInput
        v-model="form.quantity"
        label="Quantity"
        type="number"
        step="0.1"
        min="0.1"
        placeholder="1.0"
        required
        :error="errors.quantity"
        :hint="selectedFood ? `Total: ${totalCalories} calories` : ''"
      />

      <!-- Meal Type -->
      <BaseSelect
        v-model="form.mealType"
        label="Meal Type"
        required
        :error="errors.mealType"
      >
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
      </BaseSelect>

      <!-- Date and Time -->
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="form.date"
          label="Date"
          type="date"
          required
          :error="errors.date"
        />
        <BaseInput
          v-model="form.time"
          label="Time"
          type="time"
          required
          :error="errors.time"
        />
      </div>

      <!-- Notes -->
      <BaseTextarea
        v-model="form.notes"
        label="Notes (Optional)"
        placeholder="Any additional notes..."
        :rows="3"
        :error="errors.notes"
      />

      <!-- Nutrition Preview -->
      <div v-if="selectedFood && form.quantity" class="p-3 bg-gray-50 rounded-md">
        <h4 class="font-medium text-gray-900 mb-2">Nutrition Preview</h4>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>Calories: <span class="font-medium">{{ totalCalories }}</span></div>
          <div v-if="totalNutrition.protein">Protein: <span class="font-medium">{{ totalNutrition.protein }}g</span></div>
          <div v-if="totalNutrition.carbs">Carbs: <span class="font-medium">{{ totalNutrition.carbs }}g</span></div>
          <div v-if="totalNutrition.fat">Fat: <span class="font-medium">{{ totalNutrition.fat }}g</span></div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4">
        <BaseButton
          variant="secondary"
          @click="$emit('cancel')"
          type="button"
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          :disabled="!canSubmit"
          :loading="isSubmitting"
        >
          {{ isEditing ? 'Update Entry' : 'Add Entry' }}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { FoodItem, CreateCalorieEntryInput, UpdateCalorieEntryInput, CalorieEntry } from '../_types/calorie'
import { useCalorieManager } from '../_composables/use-calorie-manager'
import { useCalorieFilters } from '../_composables/use-calorie-filters'
import { calculateNutrition, getMealTypeFromTime } from '../_utils/calorie-helpers'
import { CreateCalorieEntrySchema, UpdateCalorieEntrySchema } from '../_types/calorie'

interface Props {
  entry?: CalorieEntry
  isEditing?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  add: [data: CreateCalorieEntryInput]
  update: [data: UpdateCalorieEntryInput]
  cancel: []
}>()

const { searchFoodItems, filterFoodsByCategory } = useCalorieFilters()
const { addEntry, updateEntry, isLoading, initialize, isInitialized } = useCalorieManager()

// Form state
const form = ref({
  quantity: 1,
  mealType: '',
  date: '',
  time: '',
  notes: ''
})

// Food search state
const searchQuery = ref('')
const selectedFood = ref<FoodItem | null>(null)
const showFoodList = ref(false)
const filteredFoods = ref<FoodItem[]>([])
const showAddFoodModal = ref(false)

// Validation state
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

// Initialize form
onMounted(async () => {
  // Ensure store is initialized
  if (!isInitialized()) {
    await initialize()
  }

  const now = new Date()
  form.value.date = now.toISOString().split('T')[0]
  form.value.time = now.toTimeString().slice(0, 5)
  form.value.mealType = getMealTypeFromTime(now)

  // Initialize with some default foods
  filteredFoods.value = filterFoodsByCategory('fruits').slice(0, 5)

  // If editing, populate form
  if (props.isEditing && props.entry) {
    // Load existing entry data
    const consumedAt = new Date(props.entry.consumedAt)
    form.value = {
      quantity: props.entry.quantity,
      mealType: props.entry.mealType,
      date: consumedAt.toISOString().split('T')[0],
      time: consumedAt.toTimeString().slice(0, 5),
      notes: props.entry.notes || ''
    }
    
    // Find and set the selected food
    // This would need to be implemented based on your store structure
    // selectedFood.value = getFoodById(props.entry.foodId)
  }
})

// Computed properties
const totalCalories = computed(() => {
  if (!selectedFood.value || !form.value.quantity) return 0
  return calculateNutrition(selectedFood.value.nutrition, form.value.quantity).calories
})

const totalNutrition = computed(() => {
  if (!selectedFood.value || !form.value.quantity) {
    return { calories: 0 }
  }
  return calculateNutrition(selectedFood.value.nutrition, form.value.quantity)
})

const canSubmit = computed(() => {
  return selectedFood.value && 
         form.value.quantity > 0 && 
         form.value.mealType && 
         form.value.date && 
         form.value.time &&
         !isSubmitting.value
})

// Food search
const onFoodSearch = (query: string) => {
  // Only search if store is initialized
  if (!isInitialized()) {
    return
  }

  if (query.length > 0) {
    filteredFoods.value = searchFoodItems(query).slice(0, 10)
  } else {
    filteredFoods.value = filterFoodsByCategory('fruits').slice(0, 5) // Show some default foods
  }
  showFoodList.value = true
}

const selectFood = (food: FoodItem) => {
  selectedFood.value = food
  searchQuery.value = food.name
  showFoodList.value = false
  clearError('foodId')
}

const clearSelectedFood = () => {
  selectedFood.value = null
  searchQuery.value = ''
  showFoodList.value = false
}

// Validation
const validateForm = () => {
  errors.value = {}
  
  if (!selectedFood.value) {
    errors.value.foodId = 'Please select a food item'
  }
  
  if (!form.value.quantity || form.value.quantity <= 0) {
    errors.value.quantity = 'Quantity must be greater than 0'
  }
  
  if (!form.value.mealType) {
    errors.value.mealType = 'Please select a meal type'
  }
  
  if (!form.value.date) {
    errors.value.date = 'Please select a date'
  }
  
  if (!form.value.time) {
    errors.value.time = 'Please select a time'
  }

  return Object.keys(errors.value).length === 0
}

const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  
  try {
    const consumedAt = new Date(`${form.value.date}T${form.value.time}`)
    
    const entryData = {
      foodId: selectedFood.value!.id,
      quantity: Number(form.value.quantity),
      mealType: form.value.mealType as any,
      consumedAt,
      notes: form.value.notes || undefined
    }

    // Validate with Zod
    if (props.isEditing) {
      UpdateCalorieEntrySchema.parse(entryData)
      emit('update', entryData)
    } else {
      CreateCalorieEntrySchema.parse(entryData)
      emit('add', entryData)
    }
  } catch (error) {
    console.error('Form submission error:', error)
    if (error instanceof Error) {
      errors.value.submit = error.message
    }
  } finally {
    isSubmitting.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (!(event.target as Element).closest('.relative')) {
    showFoodList.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Watch for changes to clear errors
watch(() => form.value.quantity, () => clearError('quantity'))
watch(() => form.value.mealType, () => clearError('mealType'))
watch(() => form.value.date, () => clearError('date'))
watch(() => form.value.time, () => clearError('time'))
</script>

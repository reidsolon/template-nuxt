<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Calorie Dashboard</h1>
        <p class="text-gray-600">{{ formatDate(selectedDate) }}</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Date Navigation -->
        <div class="flex items-center space-x-2">
          <BaseButton
            variant="secondary"
            size="sm"
            @click="previousDay"
          >
            <Icon name="heroicons:chevron-left" class="w-4 h-4" />
          </BaseButton>
          
          <BaseInput
            v-model="dateInput"
            type="date"
            @change="updateSelectedDate"
            class="w-auto"
          />
          
          <BaseButton
            variant="secondary"
            size="sm"
            @click="nextDay"
            :disabled="isToday"
          >
            <Icon name="heroicons:chevron-right" class="w-4 h-4" />
          </BaseButton>
        </div>
        
        <BaseButton @click="showAddForm = true">
          <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
          Add Entry
        </BaseButton>
      </div>
    </div>

    <!-- Progress Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Calories Progress -->
      <BaseCard class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-700">Calories</h3>
          <Icon name="heroicons:fire" class="w-5 h-5 text-orange-500" />
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between items-baseline">
            <span class="text-2xl font-bold text-gray-900">{{ progress.consumed }}</span>
            <span class="text-sm text-gray-500">of {{ progress.goal }}</span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-orange-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${Math.min(progress.percentage, 100)}%` }"
            ></div>
          </div>
          
          <p class="text-xs text-gray-500">
            {{ progress.remaining > 0 ? `${progress.remaining} remaining` : `${Math.abs(progress.remaining)} over` }}
          </p>
        </div>
      </BaseCard>

      <!-- Protein -->
      <BaseCard class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-700">Protein</h3>
          <Icon name="heroicons:beaker" class="w-5 h-5 text-blue-500" />
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between items-baseline">
            <span class="text-2xl font-bold text-gray-900">
              {{ Math.round(summary.totalNutrition.protein || 0) }}g
            </span>
            <span class="text-sm text-gray-500">
              of {{ activeGoal?.protein || 0 }}g
            </span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${getProteinProgress()}%` }"
            ></div>
          </div>
        </div>
      </BaseCard>

      <!-- Carbs -->
      <BaseCard class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-700">Carbs</h3>
          <Icon name="heroicons:cube" class="w-5 h-5 text-green-500" />
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between items-baseline">
            <span class="text-2xl font-bold text-gray-900">
              {{ Math.round(summary.totalNutrition.carbs || 0) }}g
            </span>
            <span class="text-sm text-gray-500">
              of {{ activeGoal?.carbs || 0 }}g
            </span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-green-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${getCarbsProgress()}%` }"
            ></div>
          </div>
        </div>
      </BaseCard>

      <!-- Fat -->
      <BaseCard class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-700">Fat</h3>
          <Icon name="heroicons:drop" class="w-5 h-5 text-yellow-500" />
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between items-baseline">
            <span class="text-2xl font-bold text-gray-900">
              {{ Math.round(summary.totalNutrition.fat || 0) }}g
            </span>
            <span class="text-sm text-gray-500">
              of {{ activeGoal?.fat || 0 }}g
            </span>
          </div>
          
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${getFatProgress()}%` }"
            ></div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Meal Breakdown -->
    <BaseCard>
      <template #header>
        <h2 class="text-lg font-semibold text-gray-900">Meal Breakdown</h2>
      </template>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="(calories, mealType) in summary.mealBreakdown"
          :key="mealType"
          class="text-center p-4 bg-gray-50 rounded-lg"
        >
          <div class="text-sm font-medium text-gray-700 mb-1">
            {{ capitalizeFirst(mealType) }}
          </div>
          <div class="text-lg font-bold text-gray-900">
            {{ Math.round(calories) }}
          </div>
          <div class="text-xs text-gray-500">calories</div>
        </div>
      </div>
    </BaseCard>

    <!-- Today's Entries -->
    <BaseCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Today's Entries</h2>
          <BaseBadge>{{ summary.entries.length }} entries</BaseBadge>
        </div>
      </template>
      
      <div v-if="summary.entries.length === 0" class="text-center py-8">
        <Icon name="heroicons:clipboard-document-list" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">No entries for this day yet.</p>
        <BaseButton @click="showAddForm = true">
          <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
          Add First Entry
        </BaseButton>
      </div>
      
      <div v-else class="space-y-3">
        <CalorieEntryItem
          v-for="entry in summary.entries"
          :key="entry.id"
          :entry="entry"
          @edit="handleEdit"
          @delete="handleDelete"
          @duplicate="handleDuplicate"
        />
      </div>
    </BaseCard>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard class="p-4">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Icon name="heroicons:chart-bar" class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Weekly Average</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ Math.round(weeklyAverage) }} cal/day
            </p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="p-4">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <Icon name="heroicons:calendar" class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Monthly Average</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ Math.round(monthlyAverage) }} cal/day
            </p>
          </div>
        </div>
      </BaseCard>
      
      <BaseCard class="p-4">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-purple-100 rounded-lg">
            <Icon name="heroicons:target" class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-gray-600">Goal Progress</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ progress.percentage }}%
            </p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Add Entry Modal -->
    <div 
      v-if="showAddForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showAddForm = false"
    >
      <div @click.stop class="w-full max-w-2xl">
        <CalorieEntryForm
          @add="handleAdd"
          @cancel="showAddForm = false"
        />
      </div>
    </div>

    <!-- Edit Entry Modal -->
    <div 
      v-if="showEditForm && editingEntry"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="showEditForm = false"
    >
      <div @click.stop class="w-full max-w-2xl">
        <CalorieEntryForm
          :entry="editingEntry"
          :is-editing="true"
          @update="handleUpdate"
          @cancel="showEditForm = false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { CalorieEntryWithFood, CreateCalorieEntryInput, UpdateCalorieEntryInput, CalorieEntry } from '../_types/calorie'
import { useCalorieManager } from '../_composables/use-calorie-manager'
import { formatDate } from '../_utils/calorie-helpers'
import CalorieEntryForm from './CalorieEntryForm.vue'
import CalorieEntryItem from './CalorieEntryItem.vue'

const {
  initialize,
  getDateSummary,
  getDateProgress,
  getActiveGoal,
  getWeeklyAverage,
  getMonthlyAverage,
  addEntry,
  updateEntry,
  deleteEntry,
  duplicateEntry
} = useCalorieManager()

// Component state
const selectedDate = ref(new Date())
const dateInput = ref('')
const showAddForm = ref(false)
const showEditForm = ref(false)
const editingEntry = ref<CalorieEntry | null>(null)

// Computed properties
const summary = computed(() => getDateSummary(selectedDate.value))
const progress = computed(() => getDateProgress(selectedDate.value))
const activeGoal = computed(() => getActiveGoal())
const weeklyAverage = computed(() => getWeeklyAverage())
const monthlyAverage = computed(() => getMonthlyAverage())

const isToday = computed(() => {
  return formatDate(selectedDate.value) === formatDate(new Date())
})

// Methods
const updateSelectedDate = () => {
  selectedDate.value = new Date(dateInput.value)
}

const previousDay = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() - 1)
  selectedDate.value = newDate
  dateInput.value = formatDate(newDate)
}

const nextDay = () => {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() + 1)
  selectedDate.value = newDate
  dateInput.value = formatDate(newDate)
}

const handleAdd = async (data: CreateCalorieEntryInput) => {
  try {
    await addEntry(data)
    showAddForm.value = false
  } catch (error) {
    console.error('Failed to add entry:', error)
  }
}

const handleEdit = (entry: CalorieEntryWithFood) => {
  editingEntry.value = entry as CalorieEntry
  showEditForm.value = true
}

const handleUpdate = async (data: UpdateCalorieEntryInput) => {
  if (!editingEntry.value) return
  
  try {
    await updateEntry(editingEntry.value.id, data)
    showEditForm.value = false
    editingEntry.value = null
  } catch (error) {
    console.error('Failed to update entry:', error)
  }
}

const handleDelete = async (entryId: string) => {
  try {
    await deleteEntry(entryId)
  } catch (error) {
    console.error('Failed to delete entry:', error)
  }
}

const handleDuplicate = async (entry: CalorieEntryWithFood) => {
  try {
    await duplicateEntry(entry.id)
  } catch (error) {
    console.error('Failed to duplicate entry:', error)
  }
}

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const getProteinProgress = (): number => {
  const goal = activeGoal.value?.protein || 0
  const current = summary.value.totalNutrition.protein || 0
  return goal > 0 ? Math.min((current / goal) * 100, 100) : 0
}

const getCarbsProgress = (): number => {
  const goal = activeGoal.value?.carbs || 0
  const current = summary.value.totalNutrition.carbs || 0
  return goal > 0 ? Math.min((current / goal) * 100, 100) : 0
}

const getFatProgress = (): number => {
  const goal = activeGoal.value?.fat || 0
  const current = summary.value.totalNutrition.fat || 0
  return goal > 0 ? Math.min((current / goal) * 100, 100) : 0
}

// Initialize
onMounted(async () => {
  await initialize()
  dateInput.value = formatDate(selectedDate.value)
})
</script>

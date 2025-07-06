<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start">
      <!-- Main Content -->
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <h3 class="font-medium text-gray-900">{{ entry.food.name }}</h3>
          <BaseBadge :variant="getMealTypeVariant(entry.mealType)">
            {{ capitalizeFirst(entry.mealType) }}
          </BaseBadge>
          <BaseBadge v-if="entry.food.isCustom" variant="secondary"> Custom </BaseBadge>
        </div>

        <div class="text-sm text-gray-600 mb-2">
          <div class="flex items-center space-x-4">
            <span>{{ entry.food.brand || entry.food.category }}</span>
            <span>{{ entry.quantity }} × {{ entry.food.servingSize }}{{ entry.food.servingUnit }}</span>
            <span class="font-medium text-gray-900">{{ entry.totalCalories }} cal</span>
          </div>
        </div>

        <div class="flex items-center space-x-4 text-xs text-gray-500">
          <div class="flex items-center space-x-1">
            <Icon name="heroicons:clock" class="w-4 h-4" />
            <span>{{ formatTime(entry.consumedAt) }}</span>
          </div>
          <div v-if="entry.notes" class="flex items-center space-x-1">
            <Icon name="heroicons:chat-bubble-left" class="w-4 h-4" />
            <span>{{ truncateNotes(entry.notes) }}</span>
          </div>
        </div>

        <!-- Nutrition Details (expandable) -->
        <div v-if="showNutrition" class="mt-3 p-3 bg-gray-50 rounded-md">
          <h4 class="font-medium text-gray-900 mb-2">Nutrition Information</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              Calories: <span class="font-medium">{{ entry.totalCalories }}</span>
            </div>
            <div v-if="entry.totalNutrition.protein">
              Protein: <span class="font-medium">{{ formatNutrition(entry.totalNutrition.protein) }}g</span>
            </div>
            <div v-if="entry.totalNutrition.carbs">
              Carbs: <span class="font-medium">{{ formatNutrition(entry.totalNutrition.carbs) }}g</span>
            </div>
            <div v-if="entry.totalNutrition.fat">
              Fat: <span class="font-medium">{{ formatNutrition(entry.totalNutrition.fat) }}g</span>
            </div>
            <div v-if="entry.totalNutrition.fiber">
              Fiber: <span class="font-medium">{{ formatNutrition(entry.totalNutrition.fiber) }}g</span>
            </div>
            <div v-if="entry.totalNutrition.sugar">
              Sugar: <span class="font-medium">{{ formatNutrition(entry.totalNutrition.sugar) }}g</span>
            </div>
            <div v-if="entry.totalNutrition.sodium">
              Sodium: <span class="font-medium">{{ formatNutrition(entry.totalNutrition.sodium) }}mg</span>
            </div>
          </div>
        </div>

        <!-- Full Notes (expandable) -->
        <div v-if="showFullNotes && entry.notes" class="mt-3 p-3 bg-blue-50 rounded-md">
          <h4 class="font-medium text-gray-900 mb-1">Notes</h4>
          <p class="text-sm text-gray-700">{{ entry.notes }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col space-y-2 ml-4">
        <div class="flex space-x-1">
          <button
            @click="toggleNutrition"
            class="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            :title="showNutrition ? 'Hide nutrition' : 'Show nutrition'"
          >
            <Icon name="heroicons:information-circle" class="w-4 h-4" />
          </button>

          <button
            v-if="entry.notes"
            @click="toggleNotes"
            class="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            :title="showFullNotes ? 'Hide notes' : 'Show notes'"
          >
            <Icon name="heroicons:chat-bubble-left" class="w-4 h-4" />
          </button>

          <button
            @click="handleDuplicate"
            class="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            title="Duplicate entry"
          >
            <Icon name="heroicons:document-duplicate" class="w-4 h-4" />
          </button>
        </div>

        <div class="flex space-x-1">
          <button
            @click="handleEdit"
            class="p-1 text-blue-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
            title="Edit entry"
          >
            <Icon name="heroicons:pencil" class="w-4 h-4" />
          </button>

          <button
            @click="handleDelete"
            class="p-1 text-red-400 hover:text-red-600 rounded-md hover:bg-red-50"
            title="Delete entry"
            :disabled="isDeleting"
          >
            <Icon name="heroicons:trash" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Delete -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm mx-4" @click.stop>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Entry</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this calorie entry? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="secondary" @click="showDeleteConfirm = false"> Cancel </BaseButton>
          <BaseButton variant="destructive" @click="confirmDelete" :loading="isDeleting"> Delete </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CalorieEntryWithFood } from '../_types/calorie';
import { formatNutritionValue } from '../_utils/calorie-helpers';

interface Props {
  entry: CalorieEntryWithFood;
  compact?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [entry: CalorieEntryWithFood];
  delete: [entryId: string];
  duplicate: [entry: CalorieEntryWithFood];
}>();

// Component state
const showNutrition = ref(false);
const showFullNotes = ref(false);
const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

// Methods
const toggleNutrition = () => {
  showNutrition.value = !showNutrition.value;
};

const toggleNotes = () => {
  showFullNotes.value = !showFullNotes.value;
};

const handleEdit = () => {
  emit('edit', props.entry);
};

const handleDelete = () => {
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  try {
    emit('delete', props.entry.id);
    showDeleteConfirm.value = false;
  } finally {
    isDeleting.value = false;
  }
};

const handleDuplicate = () => {
  emit('duplicate', props.entry);
};

// Utility methods
const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getMealTypeVariant = (
  mealType: string
): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  const variants = {
    breakfast: 'warning' as const,
    lunch: 'success' as const,
    dinner: 'primary' as const,
    snack: 'secondary' as const,
  };
  return variants[mealType as keyof typeof variants] || 'default';
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const truncateNotes = (notes: string, maxLength: number = 30): string => {
  if (notes.length <= maxLength) return notes;
  return notes.substring(0, maxLength) + '...';
};

const formatNutrition = (value: number | undefined): string => {
  if (value === undefined) return '0';
  return value.toFixed(1);
};
</script>

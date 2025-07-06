<template>
  <div class="space-y-4">
    <!-- Header with controls -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ title || 'Calorie Entries' }}
      </h2>

      <div class="flex items-center space-x-2">
        <!-- View toggle -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          <button
            @click="viewMode = 'list'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            List
          </button>
          <button
            @click="viewMode = 'grouped'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              viewMode === 'grouped' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Grouped
          </button>
        </div>

        <!-- Add button -->
        <BaseButton v-if="!hideAddButton" @click="$emit('add')" size="sm">
          <Icon name="heroicons:plus" class="w-4 h-4 mr-1" />
          Add Entry
        </BaseButton>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="bg-gray-50 p-4 rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseSelect v-model="filters.mealType" label="Meal Type" placeholder="All meals" @change="applyFilters">
          <option value="">All meals</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </BaseSelect>

        <BaseSelect v-model="filters.category" label="Category" placeholder="All categories" @change="applyFilters">
          <option value="">All categories</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
          <option value="grains">Grains</option>
          <option value="proteins">Proteins</option>
          <option value="dairy">Dairy</option>
          <option value="snacks">Snacks</option>
          <option value="beverages">Beverages</option>
          <option value="other">Other</option>
        </BaseSelect>

        <BaseInput v-model="filters.search" label="Search" placeholder="Search entries..." @input="applyFilters" />

        <div class="flex items-end">
          <BaseButton variant="secondary" @click="clearFilters" size="sm"> Clear </BaseButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="displayedEntries.length === 0" class="text-center py-12">
      <Icon name="heroicons:clipboard-document-list" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ filteredEntries.length === 0 ? 'No entries found' : 'No matching entries' }}
      </h3>
      <p class="text-gray-500 mb-4">
        {{
          filteredEntries.length === 0
            ? 'Start tracking your calories by adding your first entry.'
            : "Try adjusting your filters to find what you're looking for."
        }}
      </p>
      <BaseButton v-if="filteredEntries.length === 0 && !hideAddButton" @click="$emit('add')">
        <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
        Add First Entry
      </BaseButton>
    </div>

    <!-- List View -->
    <div v-else-if="viewMode === 'list'" class="space-y-3">
      <CalorieEntryItem
        v-for="entry in displayedEntries"
        :key="entry.id"
        :entry="entry"
        @edit="handleEdit"
        @delete="handleDelete"
        @duplicate="handleDuplicate"
      />
    </div>

    <!-- Grouped View -->
    <div v-else class="space-y-6">
      <div
        v-for="group in groupedEntries"
        :key="group.date"
        class="bg-white border border-gray-200 rounded-lg overflow-hidden"
      >
        <!-- Group Header -->
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="font-medium text-gray-900">
              {{ formatDateHeader(group.date) }}
            </h3>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>{{ group.entries.length }} entries</span>
              <span class="font-medium">{{ group.totalCalories }} calories</span>
            </div>
          </div>
        </div>

        <!-- Group Entries -->
        <div class="divide-y divide-gray-200">
          <div v-for="entry in group.entries" :key="entry.id" class="p-4">
            <CalorieEntryItem
              :entry="entry"
              compact
              @edit="handleEdit"
              @delete="handleDelete"
              @duplicate="handleDuplicate"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center space-x-2">
      <BaseButton variant="secondary" size="sm" @click="currentPage > 1 && currentPage--" :disabled="currentPage === 1">
        Previous
      </BaseButton>

      <span class="px-3 py-1 text-sm text-gray-600"> Page {{ currentPage }} of {{ totalPages }} </span>

      <BaseButton
        variant="secondary"
        size="sm"
        @click="currentPage < totalPages && currentPage++"
        :disabled="currentPage === totalPages"
      >
        Next
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { CalorieEntryWithFood, CalorieFilter } from '../_types/calorie';
import { useCalorieFilters } from '../_composables/use-calorie-filters';
import { formatDate } from '../_utils/calorie-helpers';
import CalorieEntryItem from './CalorieEntryItem.vue';

interface Props {
  entries: CalorieEntryWithFood[];
  title?: string;
  showFilters?: boolean;
  hideAddButton?: boolean;
  itemsPerPage?: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFilters: true,
  itemsPerPage: 10,
  loading: false,
});

const emit = defineEmits<{
  add: [];
  edit: [entry: CalorieEntryWithFood];
  delete: [entryId: string];
  duplicate: [entry: CalorieEntryWithFood];
}>();

const { filterAndSortEntries } = useCalorieFilters();

// Component state
const viewMode = ref<'list' | 'grouped'>('list');
const currentPage = ref(1);

// Filters
const filters = ref<CalorieFilter>({
  mealType: undefined,
  category: undefined,
  search: undefined,
});

// Computed properties
const filteredEntries = computed(() => {
  return filterAndSortEntries(props.entries, filters.value);
});

const displayedEntries = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return filteredEntries.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredEntries.value.length / props.itemsPerPage);
});

const groupedEntries = computed(() => {
  const groups = new Map<string, CalorieEntryWithFood[]>();

  filteredEntries.value.forEach((entry) => {
    const date = formatDate(entry.consumedAt);
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(entry);
  });

  return Array.from(groups.entries())
    .map(([date, entries]) => ({
      date,
      entries,
      totalCalories: entries.reduce((sum, entry) => sum + entry.totalCalories, 0),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Methods
const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when filtering
};

const clearFilters = () => {
  filters.value = {
    mealType: undefined,
    category: undefined,
    search: undefined,
  };
  currentPage.value = 1;
};

const handleEdit = (entry: CalorieEntryWithFood) => {
  emit('edit', entry);
};

const handleDelete = (entryId: string) => {
  emit('delete', entryId);
};

const handleDuplicate = (entry: CalorieEntryWithFood) => {
  emit('duplicate', entry);
};

const formatDateHeader = (date: string): string => {
  const entryDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (formatDate(entryDate) === formatDate(today)) {
    return 'Today';
  } else if (formatDate(entryDate) === formatDate(yesterday)) {
    return 'Yesterday';
  } else {
    return entryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
};

// Reset page when entries change
watch(
  () => props.entries,
  () => {
    currentPage.value = 1;
  }
);
</script>

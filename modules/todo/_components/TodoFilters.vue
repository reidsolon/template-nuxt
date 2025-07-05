<template>
  <BaseCard title="Filters">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <BaseInput
        v-model="searchQuery"
        placeholder="Search todos..."
        @input="handleSearchChange"
      />

      <!-- Status Filter -->
      <BaseSelect
        v-model="statusFilter"
        placeholder="All Status"
        @change="handleFilterChange"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </BaseSelect>

      <!-- Priority Filter -->
      <BaseSelect
        v-model="priorityFilter"
        placeholder="All Priorities"
        @change="handleFilterChange"
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </BaseSelect>

      <!-- Category Filter -->
      <BaseSelect
        v-model="categoryFilter"
        placeholder="All Categories"
        @change="handleFilterChange"
      >
        <option value="">All Categories</option>
        <option v-for="category in availableCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </BaseSelect>
    </div>

    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="mt-4 flex flex-wrap gap-2">
      <span class="text-sm text-gray-600">Active filters:</span>
      <BaseBadge
        v-if="searchQuery"
        variant="primary"
        class="cursor-pointer"
        @click="clearSearch"
      >
        Search: "{{ searchQuery }}" ×
      </BaseBadge>
      <BaseBadge
        v-if="statusFilter"
        variant="primary"
        class="cursor-pointer"
        @click="clearStatusFilter"
      >
        Status: {{ statusFilter }} ×
      </BaseBadge>
      <BaseBadge
        v-if="priorityFilter"
        variant="primary"
        class="cursor-pointer"
        @click="clearPriorityFilter"
      >
        Priority: {{ priorityFilter }} ×
      </BaseBadge>
      <BaseBadge
        v-if="categoryFilter"
        variant="primary"
        class="cursor-pointer"
        @click="clearCategoryFilter"
      >
        Category: {{ categoryFilter }} ×
      </BaseBadge>
      <BaseButton
        size="sm"
        variant="ghost"
        @click="clearAllFilters"
      >
        Clear All
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { TodoFilter } from '../_types/todo'

interface Props {
  availableCategories?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  availableCategories: () => []
})

const emit = defineEmits<{
  'filter-change': [filter: TodoFilter]
  'search-change': [search: string]
}>()

// Filter state
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const categoryFilter = ref('')

// Computed
const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || statusFilter.value || priorityFilter.value || categoryFilter.value)
})

// Build filter object
const buildFilter = (): TodoFilter => {
  const filter: TodoFilter = {}
  
  if (searchQuery.value) {
    filter.search = searchQuery.value
  }
  
  if (statusFilter.value) {
    filter.completed = statusFilter.value === 'completed'
  }
  
  if (priorityFilter.value) {
    filter.priority = priorityFilter.value as 'low' | 'medium' | 'high'
  }
  
  if (categoryFilter.value) {
    filter.category = categoryFilter.value
  }
  
  return filter
}

// Handle filter changes
const handleFilterChange = () => {
  emit('filter-change', buildFilter())
}

// Handle search changes
const handleSearchChange = () => {
  emit('search-change', searchQuery.value)
  handleFilterChange()
}

// Clear individual filters
const clearSearch = () => {
  searchQuery.value = ''
  handleFilterChange()
}

const clearStatusFilter = () => {
  statusFilter.value = ''
  handleFilterChange()
}

const clearPriorityFilter = () => {
  priorityFilter.value = ''
  handleFilterChange()
}

const clearCategoryFilter = () => {
  categoryFilter.value = ''
  handleFilterChange()
}

// Clear all filters
const clearAllFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  categoryFilter.value = ''
  handleFilterChange()
}
</script>

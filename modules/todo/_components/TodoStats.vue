<template>
  <BaseCard title="Todo Statistics">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Todos -->
      <div class="text-center">
        <div class="text-3xl font-bold text-gray-900">
          {{ stats.total }}
        </div>
        <div class="text-sm text-gray-500">Total Todos</div>
      </div>

      <!-- Completed Todos -->
      <div class="text-center">
        <div class="text-3xl font-bold text-green-600">
          {{ stats.completed }}
        </div>
        <div class="text-sm text-gray-500">Completed</div>
      </div>

      <!-- Pending Todos -->
      <div class="text-center">
        <div class="text-3xl font-bold text-yellow-600">
          {{ stats.pending }}
        </div>
        <div class="text-sm text-gray-500">Pending</div>
      </div>

      <!-- Completion Rate -->
      <div class="text-center">
        <div class="text-3xl font-bold text-blue-600">{{ stats.completionRate }}%</div>
        <div class="text-sm text-gray-500">Completion Rate</div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mt-6">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{{ stats.completed }}/{{ stats.total }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${stats.completionRate}%` }"
        />
      </div>
    </div>

    <!-- Priority Breakdown -->
    <div v-if="stats.total > 0" class="mt-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Priority Breakdown</h4>
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">
            {{ stats.priorityStats.high }}
          </div>
          <div class="text-xs text-gray-500">High Priority</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600">
            {{ stats.priorityStats.medium }}
          </div>
          <div class="text-xs text-gray-500">Medium Priority</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ stats.priorityStats.low }}
          </div>
          <div class="text-xs text-gray-500">Low Priority</div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  priorityStats: {
    high: number;
    medium: number;
    low: number;
  };
}

interface Props {
  stats: TodoStats;
}

defineProps<Props>();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CalorieDashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import CalorieDashboard from '../../modules/calorie/_components/CalorieDashboard.vue';

// Set page meta
definePageMeta({
  title: 'Calorie Tracker',
  description: 'Track your daily calories and nutrition',
});

useHead({
  title: 'Calorie Tracker - Dashboard',
  meta: [
    {
      name: 'description',
      content:
        'Track your daily calories, monitor your nutrition goals, and stay healthy with our comprehensive calorie tracking dashboard.',
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
        <p class="text-xl text-gray-600">Manage your tasks and track your health goals</p>
      </div>

      <!-- Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <!-- Todo App Card -->
        <NuxtLink to="/todos" class="group">
          <div class="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="p-3 bg-blue-100 rounded-lg mr-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Todo Manager
                </h3>
                <p class="text-gray-600">Organize your daily tasks</p>
              </div>
            </div>
            <p class="text-gray-700 mb-4">
              Keep track of your tasks with our powerful todo management system. Create, organize, and complete your
              daily goals with ease.
            </p>
            <div class="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
              <span>Get started</span>
              <svg
                class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </NuxtLink>

        <!-- Calorie Tracker Card -->
        <NuxtLink to="/calorie" class="group">
          <div class="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow border border-gray-200">
            <div class="flex items-center mb-4">
              <div class="p-3 bg-green-100 rounded-lg mr-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  Calorie Tracker
                </h3>
                <p class="text-gray-600">Monitor your nutrition goals</p>
              </div>
            </div>
            <p class="text-gray-700 mb-4">
              Track your daily calorie intake, monitor nutrition goals, and maintain a healthy lifestyle with our
              comprehensive calorie tracking system.
            </p>
            <div class="flex items-center text-green-600 group-hover:text-green-700 font-medium">
              <span>Start tracking</span>
              <svg
                class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Quick Stats -->
      <div class="mt-16 text-center">
        <h2 class="text-2xl font-semibold text-gray-900 mb-8">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="p-4 bg-blue-50 rounded-lg inline-block mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Task Management</h3>
            <p class="text-gray-600">
              Organize, prioritize, and track your daily tasks with advanced filtering and categorization.
            </p>
          </div>

          <div class="text-center">
            <div class="p-4 bg-green-50 rounded-lg inline-block mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Nutrition Tracking</h3>
            <p class="text-gray-600">
              Monitor your calorie intake, track macronutrients, and work towards your health goals.
            </p>
          </div>

          <div class="text-center">
            <div class="p-4 bg-purple-50 rounded-lg inline-block mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2M7 4h10"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Data Persistence</h3>
            <p class="text-gray-600">
              Your data is safely stored locally with export/import capabilities for backup and portability.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Set head
useHead({
  title: 'Dashboard - Task & Health Management',
  meta: [
    {
      name: 'description',
      content:
        'Welcome to your personal dashboard - manage your daily tasks and track your health goals all in one place.',
    },
  ],
});
</script>

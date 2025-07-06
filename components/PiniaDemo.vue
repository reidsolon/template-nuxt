<template>
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Pinia Counter Store Demo</h2>

    <div class="space-y-4">
      <!-- Counter Display -->
      <div class="text-center">
        <div class="text-4xl font-bold text-blue-600 mb-2">
          {{ counterStore.state.count }}
        </div>
        <div class="text-sm text-gray-600">Double: {{ counterStore.doubleCount }}</div>
      </div>

      <!-- Control Buttons -->
      <div class="flex gap-2 justify-center">
        <BaseButton variant="default" @click="counterStore.increment"> +1 </BaseButton>

        <BaseButton variant="secondary" @click="counterStore.decrement"> -1 </BaseButton>

        <BaseButton variant="destructive" @click="counterStore.reset"> Reset </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
// Using the Pinia store
const counterStore = useCounterStore();
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <div v-if="title || $slots.header" class="mb-4">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
      </slot>
    </div>

    <div class="space-y-4">
      <slot />
    </div>

    <div v-if="$slots.footer" class="mt-6 pt-4 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
}

defineProps<Props>();
</script>

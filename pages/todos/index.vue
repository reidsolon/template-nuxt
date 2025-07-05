<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <TodoList />
    </div>
  </div>
</template>

<script setup lang="ts">
import TodoList from "~/modules/todo/_components/TodoList.vue";

// Set page meta
definePageMeta({
  title: "Todos",
});

// Set head
useHead({
  title: "Todos - My Todo App",
  meta: [
    {
      name: "description",
      content:
        "Manage your todos efficiently with our simple and intuitive todo application.",
    },
  ],
});
</script>

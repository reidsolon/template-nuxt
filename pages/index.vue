<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
// Set head
useHead({
  title: "Home - My Todo App",
  meta: [
    {
      name: "description",
      content:
        "Welcome to My Todo App - a simple and efficient way to manage your daily tasks.",
    },
  ],
});
</script>

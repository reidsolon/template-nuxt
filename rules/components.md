# Component Guidelines

## Purpose and Overview

### Purpose

This document establishes consistent standards for Vue component development to ensure maintainability, readability, and team collaboration.

### Overview

Rules and guidelines for creating and maintaining Vue components in this project.

## Naming Convention

- Use PascalCase for component names
- Use descriptive and meaningful names
- Avoid abbreviations when possible

### File Organization

```

```

components/
├── global/
│ ├── AppHeader.vue # Global shared components
│ ├── AppFooter.vue # Global shared components
│ └── AppNavigation.vue # Global shared components
├── ui/
│ ├── BaseButton.vue # Reusable UI components
│ ├── BaseInput.vue # Reusable UI components
│ └── BaseModal.vue # Reusable UI components
└── modules/
├── user/
│ ├── UserProfile.vue # Feature-specific components
│ ├── UserCard.vue # Feature-specific components
│ └── UserSettings.vue # Feature-specific components
├── dashboard/
│ ├── DashboardStats.vue # Feature-specific components
│ └── DashboardChart.vue # Feature-specific components
└── settings/
├── SettingsForm.vue # Feature-specific components
└── SettingsToggle.vue # Feature-specific components

```

```

## Props

- Define prop types explicitly
- Provide default values when appropriate
- Use descriptive prop names

## Emits

- Declare all emitted events
- Use kebab-case for event names
- Include payload types in TypeScript projects

## Best Practices

- Keep template logic minimal
- Use computed properties for derived data
- Implement proper error handling
- Write unit tests for components

## Sample Component

```vue
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <button @click="handleClick">
      {{ isLoading ? "Loading..." : "Contact" }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  user: User;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  contact: [userId: number];
}>();

const isLoading: Ref<boolean> = useState("user-card-loading", () => false);

const handleClick = async (): Promise<void> => {
  if (props.disabled) return;

  isLoading.value = true;
  try {
    emit("contact", props.user.id);
  } finally {
    isLoading.value = false;
  }
};
</script>
```

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      id="title"
      v-model="form.title"
      label="Title"
      placeholder="Enter todo title"
      required
      :error="errors.title"
    />

    <BaseTextarea
      id="description"
      v-model="form.description"
      label="Description"
      placeholder="Enter todo description (optional)"
      :rows="3"
      :error="errors.description"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseSelect
        id="priority"
        v-model="form.priority"
        label="Priority"
        placeholder="Select priority"
        :error="errors.priority"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </BaseSelect>

      <BaseInput
        id="category"
        v-model="form.category"
        label="Category"
        placeholder="Enter category (optional)"
        :error="errors.category"
      />
    </div>

    <div class="flex justify-end space-x-3">
      <BaseButton type="button" variant="outline" @click="$emit('cancel')"> Cancel </BaseButton>
      <BaseButton type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : editingTodo ? 'Update' : 'Create' }}
      </BaseButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { TodoItem, CreateTodoInput } from '../_types/todo';

interface Props {
  editingTodo?: TodoItem;
  isSubmitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
});

// Form state
const form = ref<CreateTodoInput>({
  title: '',
  description: '',
  completed: false,
  priority: 'medium',
  category: '',
});

// Validation errors
const errors = ref<Record<string, string>>({});

// Initialize form with editing data
watch(
  () => props.editingTodo,
  (todo: TodoItem | undefined) => {
    if (todo) {
      form.value = {
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed,
        priority: todo.priority || 'medium',
        category: todo.category || '',
      };
    } else {
      // Reset form for new todo
      form.value = {
        title: '',
        description: '',
        completed: false,
        priority: 'medium',
        category: '',
      };
    }
    errors.value = {};
  },
  { immediate: true }
);

// Validation
const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required';
  } else if (form.value.title.trim().length > 200) {
    errors.value.title = 'Title must be less than 200 characters';
  }

  if (form.value.description && form.value.description.length > 1000) {
    errors.value.description = 'Description must be less than 1000 characters';
  }

  if (form.value.priority && !['low', 'medium', 'high'].includes(form.value.priority)) {
    errors.value.priority = 'Please select a valid priority';
  }

  return Object.keys(errors.value).length === 0;
};

// Handle form submission
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', {
      ...form.value,
      title: form.value.title.trim(),
      description: form.value.description?.trim() || undefined,
      category: form.value.category?.trim() || undefined,
    });
  }
};

const emit = defineEmits<{
  submit: [todo: CreateTodoInput];
  cancel: [];
}>();
</script>

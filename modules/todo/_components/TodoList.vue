<template>
  <div class="space-y-6">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Todos</h2>
      <BaseButton @click="showAddForm = true"> Add Todo </BaseButton>
    </div>

    <!-- Enhanced Controls -->
    <BaseCard title="Quick Actions">
      <div class="flex flex-wrap gap-2">
        <!-- Undo/Redo -->
        <BaseButton :disabled="!canUndo" @click="handleUndo" variant="outline" size="sm"> ↺ Undo </BaseButton>
        <BaseButton :disabled="!canRedo" @click="handleRedo" variant="outline" size="sm"> ↻ Redo </BaseButton>

        <!-- Batch Operations -->
        <BaseButton :disabled="selectedTodos.length === 0" @click="handleBatchComplete" variant="outline" size="sm">
          ✓ Complete Selected ({{ selectedTodos.length }})
        </BaseButton>
        <BaseButton :disabled="selectedTodos.length === 0" @click="handleBatchDelete" variant="outline" size="sm">
          🗑️ Delete Selected ({{ selectedTodos.length }})
        </BaseButton>

        <!-- Clear Selection -->
        <BaseButton v-if="selectedTodos.length > 0" @click="clearSelection" variant="outline" size="sm">
          Clear Selection
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Add/Edit Form -->
    <BaseCard v-if="showAddForm || editingTodo" title="Add New Todo">
      <TodoForm
        :editing-todo="editingTodo"
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </BaseCard>

    <!-- Filters -->
    <TodoFilters @filter-change="handleFilterChange" @search-change="handleSearchChange" />

    <!-- Stats -->
    <TodoStats :stats="todoStats" />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <span class="text-red-400">⚠️</span>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTodos.length === 0 && todos.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">📝</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
      <p class="text-gray-500 mb-4">Get started by creating your first todo!</p>
      <BaseButton @click="showAddForm = true"> Create Your First Todo </BaseButton>
    </div>

    <!-- No Results State -->
    <div v-else-if="filteredTodos.length === 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No todos match your filters</h3>
      <p class="text-gray-500">Try adjusting your search or filters</p>
    </div>

    <!-- Todo List with Selection -->
    <div v-else class="space-y-4">
      <div
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        :class="{ 'bg-blue-50 border-blue-200': selectedTodos.includes(todo.id) }"
      >
        <!-- Selection Checkbox -->
        <input
          type="checkbox"
          :checked="selectedTodos.includes(todo.id)"
          @change="toggleSelection(todo.id)"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />

        <!-- Todo Item Component -->
        <div class="flex-1">
          <TodoItem :todo="todo" @toggle="handleToggle" @edit="handleEdit" @delete="handleDelete" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TodoItem as TodoItemType, CreateTodoInput, TodoFilter } from '../_types/todo';
import { useTodoStore } from '../_stores/todo';
import { storeToRefs } from 'pinia';

// Use store directly
const todoStore = useTodoStore();
const { state, filteredTodos, todoStats, isLoading, hasError, canUndo, canRedo } = storeToRefs(todoStore);

// Store actions
const { addTodo, updateTodo, deleteTodo, toggleTodo, batchUpdateTodos, batchDeleteTodos, undo, redo, setFilter } =
  todoStore;

// Computed properties for compatibility
const todos = computed(() => state.value.todos);
const error = computed(() => state.value.error);

// Local state
const showAddForm = ref(false);
const editingTodo = ref<TodoItemType | undefined>(undefined);
const isSubmitting = ref(false);
const selectedTodos = ref<string[]>([]);

// Selection methods
const toggleSelection = (todoId: string) => {
  const index = selectedTodos.value.indexOf(todoId);
  if (index > -1) {
    selectedTodos.value.splice(index, 1);
  } else {
    selectedTodos.value.push(todoId);
  }
};

const clearSelection = () => {
  selectedTodos.value = [];
};

// Batch operations
const handleBatchComplete = async () => {
  if (selectedTodos.value.length === 0) return;

  await batchUpdateTodos(selectedTodos.value, { completed: true });
  clearSelection();
};

const handleBatchDelete = async () => {
  if (selectedTodos.value.length === 0) return;

  if (confirm(`Are you sure you want to delete ${selectedTodos.value.length} todos?`)) {
    await batchDeleteTodos(selectedTodos.value);
    clearSelection();
  }
};

// Undo/Redo handlers
const handleUndo = () => {
  undo();
};

const handleRedo = () => {
  redo();
};

// Handle form submission
const handleSubmit = async (todoData: CreateTodoInput) => {
  isSubmitting.value = true;

  try {
    if (editingTodo.value) {
      // Update existing todo
      await updateTodo(editingTodo.value.id, todoData);
    } else {
      // Add new todo
      await addTodo(todoData);
    }

    // Reset form state
    showAddForm.value = false;
    editingTodo.value = undefined;
  } catch (err) {
    console.error('Failed to save todo:', err);
  } finally {
    isSubmitting.value = false;
  }
};

// Handle form cancel
const handleCancel = () => {
  showAddForm.value = false;
  editingTodo.value = undefined;
};

// Handle todo toggle
const handleToggle = async (id: string) => {
  await toggleTodo(id);
};

// Handle todo edit
const handleEdit = (todo: TodoItemType) => {
  editingTodo.value = todo;
  showAddForm.value = false;
};

// Handle todo delete
const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this todo?')) {
    await deleteTodo(id);
  }
};

// Handle filter changes
const handleFilterChange = (filter: TodoFilter) => {
  setFilter(filter);
};

// Handle search changes
const handleSearchChange = (search: string) => {
  setFilter({ search });
};
</script>

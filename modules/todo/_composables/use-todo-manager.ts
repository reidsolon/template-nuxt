import type { TodoItem, CreateTodoInput, UpdateTodoInput } from '../_types/todo'
import { useTodoStore } from '../_stores/todo'
import { storeToRefs } from 'pinia'

/**
 * Main todo management composable
 * Now acts as a wrapper around the Pinia store for backward compatibility
 */
export const useTodoManager = () => {
  // Use Pinia store
  const todoStore = useTodoStore()
  
  // Extract reactive state using storeToRefs
  const { state, hasError, isLoading } = storeToRefs(todoStore)
  
  // Computed properties for backward compatibility
  const todos = computed(() => state.value.todos)
  const error = computed(() => state.value.error)
  const isInitialized = computed(() => state.value.isInitialized)

  // Store actions (these maintain the same API as before)
  const {
    initializeTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodoById,
    getTodosByCategory,
    searchTodos,
    clearAllTodos,
    importTodos,
    exportTodos,
    // New enhanced features
    batchUpdateTodos,
    batchDeleteTodos,
    undo,
    redo,
    canUndo,
    canRedo
  } = todoStore

  return {
    // State
    todos: readonly(todos),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isInitialized: readonly(isInitialized),
    canUndo,
    canRedo,

    // Methods
    initializeTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodoById,
    getTodosByCategory,
    searchTodos,
    clearAllTodos,
    importTodos,
    exportTodos,
    // Enhanced features
    batchUpdateTodos,
    batchDeleteTodos,
    undo,
    redo
  }
}

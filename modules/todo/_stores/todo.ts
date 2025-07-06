import { defineStore } from 'pinia';
import type { CreateTodoInput, TodoFilter, TodoItem, TodoSort, UpdateTodoInput } from '../_types/todo';
import { createTodoItem, validateTodo } from '../_utils/todo-helpers';

// Define the store state type
interface TodoState {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  filters: TodoFilter;
  sort: TodoSort;
  selectedTodo: TodoItem | null;
  lastUpdated: Date | null;
  isInitialized: boolean;
  // Undo/Redo functionality
  history: TodoItem[][];
  historyIndex: number;
  maxHistorySize: number;
}

// Initial state with proper typing
const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
  filters: {},
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  selectedTodo: null,
  lastUpdated: null,
  isInitialized: false,
  // Undo/Redo functionality
  history: [],
  historyIndex: -1,
  maxHistorySize: 10,
};

export const useTodoStore = defineStore('todo', () => {
  // State
  const state = ref<TodoState>(initialState);

  // Getters
  const filteredTodos = computed((): TodoItem[] => {
    let result = [...state.value.todos];

    // Apply filters
    const filters = state.value.filters;

    if (filters.completed !== undefined) {
      result = result.filter((todo) => todo.completed === filters.completed);
    }

    if (filters.priority) {
      result = result.filter((todo) => todo.priority === filters.priority);
    }

    if (filters.category) {
      result = result.filter((todo) => todo.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          (todo.description && todo.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    const sort = state.value.sort;
    result.sort((a, b) => {
      let aValue: any = a[sort.field];
      let bValue: any = b[sort.field];

      if (sort.field === 'createdAt' || sort.field === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sort.field === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0;
      }

      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  });

  const todoStats = computed(() => {
    const todos = state.value.todos;
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const highPriority = todos.filter((todo) => todo.priority === 'high').length;
    const categories = [...new Set(todos.map((todo) => todo.category).filter(Boolean))];

    return {
      total,
      completed,
      pending,
      highPriority,
      categories: categories.length,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      priorityStats: {
        high: todos.filter((todo) => todo.priority === 'high').length,
        medium: todos.filter((todo) => todo.priority === 'medium').length,
        low: todos.filter((todo) => todo.priority === 'low').length,
      },
    };
  });

  const todosByCategory = computed(() => {
    const todos = state.value.todos;
    const grouped: Record<string, TodoItem[]> = {};

    todos.forEach((todo) => {
      const category = todo.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(todo);
    });

    return grouped;
  });

  const todosByPriority = computed(() => {
    const todos = state.value.todos;
    return {
      high: todos.filter((todo) => todo.priority === 'high'),
      medium: todos.filter((todo) => todo.priority === 'medium'),
      low: todos.filter((todo) => todo.priority === 'low'),
      none: todos.filter((todo) => !todo.priority),
    };
  });

  const hasError = computed((): boolean => {
    return state.value.error !== null;
  });

  const canUndo = computed((): boolean => {
    return state.value.historyIndex > 0;
  });

  const canRedo = computed((): boolean => {
    return state.value.historyIndex < state.value.history.length - 1;
  });

  const selectedTodoId = computed(() => state.value.selectedTodo?.id);

  const isLoading = computed((): boolean => {
    return state.value.loading;
  });

  // Actions
  const setLoading = (loading: boolean): void => {
    state.value.loading = loading;
  };

  const setError = (error: string | null): void => {
    state.value.error = error;
  };

  const updateLastUpdated = (): void => {
    state.value.lastUpdated = new Date();
  };

  // History management methods
  const saveToHistory = (): void => {
    const currentState = [...state.value.todos];

    // Remove future history if we're not at the end
    if (state.value.historyIndex < state.value.history.length - 1) {
      state.value.history = state.value.history.slice(0, state.value.historyIndex + 1);
    }

    // Add current state to history
    state.value.history.push(currentState);

    // Limit history size
    if (state.value.history.length > state.value.maxHistorySize) {
      state.value.history.shift();
    } else {
      state.value.historyIndex++;
    }
  };

  const undo = (): boolean => {
    if (!canUndo.value) return false;

    state.value.historyIndex--;
    const previousState = state.value.history[state.value.historyIndex];
    state.value.todos = [...previousState];
    persistTodos();
    return true;
  };

  const redo = (): boolean => {
    if (!canRedo.value) return false;

    state.value.historyIndex++;
    const nextState = state.value.history[state.value.historyIndex];
    state.value.todos = [...nextState];
    persistTodos();
    return true;
  };

  const initializeTodos = async (): Promise<void> => {
    if (state.value.isInitialized) return;

    setLoading(true);
    setError(null);

    try {
      // Import storage composable dynamically to avoid SSR issues
      const { useTodoStorage } = await import('../_composables/use-todo-storage');
      const { loadTodos, isStorageAvailable } = useTodoStorage();

      if (isStorageAvailable()) {
        const loadedTodos = loadTodos();
        state.value.todos = loadedTodos;
        updateLastUpdated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize todos');
    } finally {
      setLoading(false);
      state.value.isInitialized = true;
    }
  };

  const persistTodos = async (): Promise<void> => {
    try {
      const { useTodoStorage } = await import('../_composables/use-todo-storage');
      const { saveTodos, isStorageAvailable } = useTodoStorage();

      if (isStorageAvailable()) {
        saveTodos(state.value.todos);
        updateLastUpdated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save todos');
    }
  };

  const addTodo = async (input: CreateTodoInput): Promise<TodoItem | null> => {
    setError(null);

    // Validate input
    const validationErrors = validateTodo(input);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return null;
    }

    try {
      // Save current state to history before making changes
      saveToHistory();

      const newTodo = createTodoItem(input);
      state.value.todos.unshift(newTodo);
      await persistTodos();
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
      return null;
    }
  };

  const updateTodo = async (id: string, updates: UpdateTodoInput): Promise<boolean> => {
    setError(null);

    try {
      const index = state.value.todos.findIndex((todo) => todo.id === id);
      if (index === -1) {
        setError('Todo not found');
        return false;
      }

      const updatedTodo = {
        ...state.value.todos[index],
        ...updates,
        updatedAt: new Date(),
      };

      // Validate if title is being updated
      if (updates.title !== undefined) {
        const validationErrors = validateTodo(updatedTodo);
        if (validationErrors.length > 0) {
          setError(validationErrors.join(', '));
          return false;
        }
      }

      // Save current state to history before making changes
      saveToHistory();

      state.value.todos[index] = updatedTodo;
      await persistTodos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      return false;
    }
  };

  const deleteTodo = async (id: string): Promise<boolean> => {
    setError(null);

    try {
      const index = state.value.todos.findIndex((todo) => todo.id === id);
      if (index === -1) {
        setError('Todo not found');
        return false;
      }

      // Save current state to history before making changes
      saveToHistory();

      state.value.todos.splice(index, 1);
      await persistTodos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      return false;
    }
  };

  const toggleTodo = async (id: string): Promise<boolean> => {
    const todo = getTodoById(id);
    if (!todo) {
      setError('Todo not found');
      return false;
    }

    return await updateTodo(id, { completed: !todo.completed });
  };

  const getTodoById = (id: string): TodoItem | undefined => {
    return state.value.todos.find((todo) => todo.id === id);
  };

  const getTodosByCategory = (category: string): TodoItem[] => {
    return state.value.todos.filter((todo) => todo.category === category);
  };

  const searchTodos = (query: string): TodoItem[] => {
    const searchLower = query.toLowerCase();
    return state.value.todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchLower) ||
        (todo.description && todo.description.toLowerCase().includes(searchLower))
    );
  };

  const setFilter = (filter: TodoFilter): void => {
    state.value.filters = { ...state.value.filters, ...filter };
  };

  const resetFilters = (): void => {
    state.value.filters = {};
  };

  const setSort = (sort: TodoSort): void => {
    state.value.sort = sort;
  };

  const selectTodo = (todo: TodoItem | null): void => {
    state.value.selectedTodo = todo;
  };

  const clearAllTodos = async (): Promise<boolean> => {
    setError(null);

    try {
      state.value.todos = [];
      const { useTodoStorage } = await import('../_composables/use-todo-storage');
      const { clearTodos } = useTodoStorage();
      clearTodos();
      updateLastUpdated();
      saveToHistory();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear todos');
      return false;
    }
  };

  const importTodos = async (jsonData: string): Promise<boolean> => {
    setError(null);

    try {
      const { importTodos: importHelper } = await import('../_utils/todo-helpers');
      const importedTodos = importHelper(jsonData);
      state.value.todos = importedTodos;
      await persistTodos();
      saveToHistory();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import todos');
      return false;
    }
  };

  const exportTodos = (): string => {
    const { exportTodos: exportHelper } = require('../_utils/todo-helpers');
    return exportHelper(state.value.todos);
  };

  // Batch operations
  const batchUpdateTodos = async (ids: string[], updates: UpdateTodoInput): Promise<boolean> => {
    setError(null);

    try {
      // Save current state to history before making changes
      saveToHistory();

      let updated = false;
      for (const id of ids) {
        const index = state.value.todos.findIndex((todo) => todo.id === id);
        if (index !== -1) {
          state.value.todos[index] = {
            ...state.value.todos[index],
            ...updates,
            updatedAt: new Date(),
          };
          updated = true;
        }
      }

      if (updated) {
        await persistTodos();
      }

      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to batch update todos');
      return false;
    }
  };

  const batchDeleteTodos = async (ids: string[]): Promise<boolean> => {
    setError(null);

    try {
      // Save current state to history before making changes
      saveToHistory();

      state.value.todos = state.value.todos.filter((todo) => !ids.includes(todo.id));
      await persistTodos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to batch delete todos');
      return false;
    }
  };

  // Auto-initialize when store is created
  if (typeof window !== 'undefined' && !state.value.isInitialized) {
    initializeTodos();
  }

  return {
    // State
    state: readonly(state),

    // Getters
    filteredTodos,
    todoStats,
    todosByCategory,
    todosByPriority,
    hasError,
    isLoading,
    canUndo,
    canRedo,
    selectedTodoId,

    // Actions
    setLoading,
    setError,
    initializeTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodoById,
    getTodosByCategory,
    searchTodos,
    setFilter,
    resetFilters,
    setSort,
    selectTodo,
    clearAllTodos,
    importTodos,
    exportTodos,
    batchUpdateTodos,
    batchDeleteTodos,
    // Undo/Redo actions
    undo,
    redo,
  };
});

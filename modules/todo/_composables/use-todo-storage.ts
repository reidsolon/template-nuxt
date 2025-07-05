import type { TodoItem } from '../_types/todo'

const STORAGE_KEY = 'nuxt-todos'

/**
 * Composable for localStorage operations
 */
export const useTodoStorage = () => {
  /**
   * Save todos to localStorage
   */
  const saveTodos = (todos: TodoItem[]): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
      }
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error)
      throw new Error('Failed to save todos')
    }
  }

  /**
   * Load todos from localStorage
   */
  const loadTodos = (): TodoItem[] => {
    try {
      if (typeof window === 'undefined') {
        return []
      }

      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return []
      }

      const parsed = JSON.parse(stored)
      return parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }))
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
      return []
    }
  }

  /**
   * Clear all todos from localStorage
   */
  const clearTodos = (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to clear todos from localStorage:', error)
      throw new Error('Failed to clear todos')
    }
  }

  /**
   * Check if localStorage is available
   */
  const isStorageAvailable = (): boolean => {
    try {
      if (typeof window === 'undefined') {
        return false
      }
      const test = 'test'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  return {
    saveTodos,
    loadTodos,
    clearTodos,
    isStorageAvailable
  }
}

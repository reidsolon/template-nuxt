import type { CreateTodoInput, TodoItem } from '../_types/todo';

/**
 * Generate a unique ID for todo items
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format date for relative display (e.g., "2 hours ago")
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Validate todo item data
 */
export function validateTodo(todo: CreateTodoInput): string[] {
  const errors: string[] = [];

  if (!todo.title || todo.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (todo.title && todo.title.trim().length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (todo.description && todo.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  if (todo.priority && !['low', 'medium', 'high'].includes(todo.priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  return errors;
}

/**
 * Create a new todo item with default values
 */
export function createTodoItem(input: CreateTodoInput): TodoItem {
  const now = new Date();
  return {
    id: generateId(),
    title: input.title.trim(),
    description: input.description?.trim(),
    completed: input.completed || false,
    priority: input.priority || 'medium',
    category: input.category?.trim(),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Export todos to JSON
 */
export function exportTodos(todos: TodoItem[]): string {
  return JSON.stringify(todos, null, 2);
}

/**
 * Import todos from JSON
 */
export function importTodos(jsonString: string): TodoItem[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid format: expected array');
    }

    return parsed.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  } catch (error) {
    throw new Error(`Failed to import todos: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get priority icon
 */
export function getPriorityIcon(priority: string): string {
  switch (priority) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
}

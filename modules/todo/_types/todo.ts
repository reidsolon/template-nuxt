export interface TodoItem {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
  priority?: 'low' | 'medium' | 'high'
  category?: string
}

export interface TodoFilter {
  completed?: boolean
  priority?: 'low' | 'medium' | 'high'
  category?: string
  search?: string
}

export interface TodoSort {
  field: 'title' | 'createdAt' | 'updatedAt' | 'priority'
  direction: 'asc' | 'desc'
}

export type CreateTodoInput = Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTodoInput = Partial<Omit<TodoItem, 'id' | 'createdAt'>>

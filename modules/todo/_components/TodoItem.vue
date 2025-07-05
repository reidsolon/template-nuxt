<template>
  <BaseCard class="hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="$emit('toggle', todo.id)"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <h3 
            :class="[
              'text-lg font-medium',
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            ]"
          >
            {{ todo.title }}
          </h3>
        </div>
        
        <p 
          v-if="todo.description" 
          :class="[
            'mt-2 text-sm',
            todo.completed ? 'text-gray-400' : 'text-gray-600'
          ]"
        >
          {{ todo.description }}
        </p>
        
        <div class="flex items-center space-x-4 mt-3">
          <BaseBadge 
            :variant="getPriorityVariant(todo.priority)"
            class="inline-flex items-center"
          >
            <span class="mr-1">{{ getPriorityIcon(todo.priority || 'medium') }}</span>
            {{ todo.priority }}
          </BaseBadge>
          
          <BaseBadge 
            v-if="todo.category" 
            variant="secondary"
          >
            {{ todo.category }}
          </BaseBadge>
          
          <span class="text-xs text-gray-500">
            {{ formatRelativeDate(todo.createdAt) }}
          </span>
        </div>
      </div>
      
      <div class="flex items-center space-x-2 ml-4">
        <BaseButton
          size="sm"
          variant="ghost"
          @click="$emit('edit', todo)"
        >
          Edit
        </BaseButton>
        <BaseButton
          size="sm"
          variant="destructive"
          @click="$emit('delete', todo.id)"
        >
          Delete
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { TodoItem } from '../_types/todo'
import { formatRelativeDate, getPriorityIcon } from '../_utils/todo-helpers'

interface Props {
  todo: TodoItem
}

defineEmits<{
  toggle: [id: string]
  edit: [todo: TodoItem]
  delete: [id: string]
}>()

defineProps<Props>()

// Get priority variant for badge
const getPriorityVariant = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'default'
  }
}
</script>

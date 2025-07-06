<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Calorie Entries</h1>
        <p class="text-gray-600">Manage all your food entries and track your nutrition</p>
      </div>

      <!-- Entry List -->
      <CalorieEntryList
        :entries="entries"
        :loading="isLoading()"
        @add="showAddForm = true"
        @edit="handleEdit"
        @delete="handleDelete"
        @duplicate="handleDuplicate"
      />

      <!-- Add Entry Modal -->
      <div 
        v-if="showAddForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="showAddForm = false"
      >
        <div @click.stop class="w-full max-w-2xl">
          <CalorieEntryForm
            @add="handleAdd"
            @cancel="showAddForm = false"
          />
        </div>
      </div>

      <!-- Edit Entry Modal -->
      <div 
        v-if="showEditForm && editingEntry"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click="showEditForm = false"
      >
        <div @click.stop class="w-full max-w-2xl">
          <CalorieEntryForm
            :entry="editingEntry"
            :is-editing="true"
            @update="handleUpdate"
            @cancel="showEditForm = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { CalorieEntryWithFood, CreateCalorieEntryInput, UpdateCalorieEntryInput, CalorieEntry } from '../../modules/calorie/_types/calorie'
import { useCalorieManager } from '../../modules/calorie/_composables/use-calorie-manager'
import CalorieEntryList from '../../modules/calorie/_components/CalorieEntryList.vue'
import CalorieEntryForm from '../../modules/calorie/_components/CalorieEntryForm.vue'

// Set page meta
definePageMeta({
  title: 'Calorie Entries',
  description: 'Manage your food entries and nutrition tracking'
})

useHead({
  title: 'Calorie Entries - Manage Your Food Log',
  meta: [
    {
      name: 'description',
      content: 'View, edit, and manage all your calorie entries. Track your food intake and monitor your nutrition goals.'
    }
  ]
})

const {
  initialize,
  entriesWithFood,
  addEntry,
  updateEntry,
  deleteEntry,
  duplicateEntry,
  isLoading
} = useCalorieManager()

// Component state
const showAddForm = ref(false)
const showEditForm = ref(false)
const editingEntry = ref<CalorieEntry | null>(null)

// Computed properties
const entries = computed(() => entriesWithFood.value)

// Methods
const handleAdd = async (data: CreateCalorieEntryInput) => {
  try {
    await addEntry(data)
    showAddForm.value = false
  } catch (error) {
    console.error('Failed to add entry:', error)
    // You could show a toast notification here
  }
}

const handleEdit = (entry: CalorieEntryWithFood) => {
  editingEntry.value = entry as CalorieEntry
  showEditForm.value = true
}

const handleUpdate = async (data: UpdateCalorieEntryInput) => {
  if (!editingEntry.value) return
  
  try {
    await updateEntry(editingEntry.value.id, data)
    showEditForm.value = false
    editingEntry.value = null
  } catch (error) {
    console.error('Failed to update entry:', error)
    // You could show a toast notification here
  }
}

const handleDelete = async (entryId: string) => {
  try {
    await deleteEntry(entryId)
  } catch (error) {
    console.error('Failed to delete entry:', error)
    // You could show a toast notification here
  }
}

const handleDuplicate = async (entry: CalorieEntryWithFood) => {
  try {
    await duplicateEntry(entry.id)
  } catch (error) {
    console.error('Failed to duplicate entry:', error)
    // You could show a toast notification here
  }
}

// Initialize
onMounted(async () => {
  await initialize()
})
</script>

import type { FoodItem, CalorieEntry, CalorieGoal } from '../_types/calorie'

const STORAGE_KEYS = {
  FOOD_ITEMS: 'calorie-tracker-foods',
  CALORIE_ENTRIES: 'calorie-tracker-entries',
  CALORIE_GOALS: 'calorie-tracker-goals',
  SETTINGS: 'calorie-tracker-settings'
}

/**
 * Composable for localStorage operations
 */
export const useCalorieStorage = () => {
  // Food Items Storage
  const saveFoodItems = (foods: FoodItem[]): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(foods))
      }
    } catch (error) {
      console.error('Failed to save food items to localStorage:', error)
      throw new Error('Failed to save food items')
    }
  }

  const loadFoodItems = (): FoodItem[] => {
    try {
      if (typeof window === 'undefined') {
        return []
      }

      const stored = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS)
      if (!stored) {
        return []
      }

      const parsed = JSON.parse(stored)
      return parsed.map((food: any) => ({
        ...food,
        createdAt: new Date(food.createdAt),
        updatedAt: new Date(food.updatedAt)
      }))
    } catch (error) {
      console.error('Failed to load food items from localStorage:', error)
      return []
    }
  }

  // Calorie Entries Storage
  const saveCalorieEntries = (entries: CalorieEntry[]): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CALORIE_ENTRIES, JSON.stringify(entries))
      }
    } catch (error) {
      console.error('Failed to save calorie entries to localStorage:', error)
      throw new Error('Failed to save calorie entries')
    }
  }

  const loadCalorieEntries = (): CalorieEntry[] => {
    try {
      if (typeof window === 'undefined') {
        return []
      }

      const stored = localStorage.getItem(STORAGE_KEYS.CALORIE_ENTRIES)
      if (!stored) {
        return []
      }

      const parsed = JSON.parse(stored)
      return parsed.map((entry: any) => ({
        ...entry,
        consumedAt: new Date(entry.consumedAt),
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt)
      }))
    } catch (error) {
      console.error('Failed to load calorie entries from localStorage:', error)
      return []
    }
  }

  // Calorie Goals Storage
  const saveCalorieGoals = (goals: CalorieGoal[]): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CALORIE_GOALS, JSON.stringify(goals))
      }
    } catch (error) {
      console.error('Failed to save calorie goals to localStorage:', error)
      throw new Error('Failed to save calorie goals')
    }
  }

  const loadCalorieGoals = (): CalorieGoal[] => {
    try {
      if (typeof window === 'undefined') {
        return []
      }

      const stored = localStorage.getItem(STORAGE_KEYS.CALORIE_GOALS)
      if (!stored) {
        return []
      }

      const parsed = JSON.parse(stored)
      return parsed.map((goal: any) => ({
        ...goal,
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt)
      }))
    } catch (error) {
      console.error('Failed to load calorie goals from localStorage:', error)
      return []
    }
  }

  // Settings Storage
  const saveSettings = (settings: Record<string, any>): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
      }
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error)
      throw new Error('Failed to save settings')
    }
  }

  const loadSettings = (): Record<string, any> => {
    try {
      if (typeof window === 'undefined') {
        return {}
      }

      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (!stored) {
        return {}
      }

      return JSON.parse(stored)
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error)
      return {}
    }
  }

  // Clear Storage
  const clearAllData = (): void => {
    try {
      if (typeof window !== 'undefined') {
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key)
        })
      }
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      throw new Error('Failed to clear data')
    }
  }

  const clearFoodItems = (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.FOOD_ITEMS)
      }
    } catch (error) {
      console.error('Failed to clear food items from localStorage:', error)
      throw new Error('Failed to clear food items')
    }
  }

  const clearCalorieEntries = (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.CALORIE_ENTRIES)
      }
    } catch (error) {
      console.error('Failed to clear calorie entries from localStorage:', error)
      throw new Error('Failed to clear calorie entries')
    }
  }

  const clearCalorieGoals = (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.CALORIE_GOALS)
      }
    } catch (error) {
      console.error('Failed to clear calorie goals from localStorage:', error)
      throw new Error('Failed to clear calorie goals')
    }
  }

  // Export/Import functionality
  const exportData = (): string => {
    try {
      const data = {
        foodItems: loadFoodItems(),
        calorieEntries: loadCalorieEntries(),
        calorieGoals: loadCalorieGoals(),
        settings: loadSettings(),
        exportDate: new Date().toISOString()
      }
      
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Failed to export data:', error)
      throw new Error('Failed to export data')
    }
  }

  const importData = (jsonData: string): void => {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.foodItems) {
        saveFoodItems(data.foodItems.map((food: any) => ({
          ...food,
          createdAt: new Date(food.createdAt),
          updatedAt: new Date(food.updatedAt)
        })))
      }
      
      if (data.calorieEntries) {
        saveCalorieEntries(data.calorieEntries.map((entry: any) => ({
          ...entry,
          consumedAt: new Date(entry.consumedAt),
          createdAt: new Date(entry.createdAt),
          updatedAt: new Date(entry.updatedAt)
        })))
      }
      
      if (data.calorieGoals) {
        saveCalorieGoals(data.calorieGoals.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt)
        })))
      }
      
      if (data.settings) {
        saveSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to import data:', error)
      throw new Error('Failed to import data')
    }
  }

  // Storage size management
  const getStorageSize = (): number => {
    try {
      if (typeof window === 'undefined') {
        return 0
      }

      let totalSize = 0
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key)
        if (item) {
          totalSize += item.length
        }
      })
      
      return totalSize
    } catch (error) {
      console.error('Failed to calculate storage size:', error)
      return 0
    }
  }

  const getStorageSizeFormatted = (): string => {
    const size = getStorageSize()
    if (size < 1024) return `${size} bytes`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  return {
    // Food Items
    saveFoodItems,
    loadFoodItems,
    clearFoodItems,
    
    // Calorie Entries
    saveCalorieEntries,
    loadCalorieEntries,
    clearCalorieEntries,
    
    // Calorie Goals
    saveCalorieGoals,
    loadCalorieGoals,
    clearCalorieGoals,
    
    // Settings
    saveSettings,
    loadSettings,
    
    // Data Management
    clearAllData,
    exportData,
    importData,
    
    // Storage Info
    getStorageSize,
    getStorageSizeFormatted
  }
}

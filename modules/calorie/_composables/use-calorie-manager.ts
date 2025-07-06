import { useCalorieStore } from '../_stores/calorie';
import type {
  CalorieEntryWithFood,
  CalorieGoal,
  CalorieProgress,
  CreateCalorieEntryInput,
  CreateCalorieGoalInput,
  CreateFoodItemInput,
  DailySummary,
  FoodItem,
  UpdateCalorieEntryInput,
  UpdateCalorieGoalInput,
  UpdateFoodItemInput,
} from '../_types/calorie';
import { getMealTypeFromTime } from '../_utils/calorie-helpers';

/**
 * High-level composable for managing calorie tracking operations
 */
export const useCalorieManager = () => {
  const store = useCalorieStore();

  // Initialize the store
  const initialize = async () => {
    await store.initialize();
  };

  // Quick add entry with smart defaults
  const quickAddEntry = async (foodId: string, quantity: number, notes?: string) => {
    const now = new Date();
    const mealType = getMealTypeFromTime(now);

    const input: CreateCalorieEntryInput = {
      foodId,
      quantity,
      mealType,
      consumedAt: now,
      notes,
    };

    return await store.createCalorieEntry(input);
  };

  // Add entry with full details
  const addEntry = async (input: CreateCalorieEntryInput) => {
    return await store.createCalorieEntry(input);
  };

  // Update entry
  const updateEntry = async (id: string, input: UpdateCalorieEntryInput) => {
    return await store.updateCalorieEntry(id, input);
  };

  // Delete entry
  const deleteEntry = async (id: string) => {
    return await store.deleteCalorieEntry(id);
  };

  // Get today's summary
  const getTodaySummary = (): DailySummary => {
    return store.getDailySummary(new Date());
  };

  // Get summary for specific date
  const getDateSummary = (date: Date): DailySummary => {
    return store.getDailySummary(date);
  };

  // Get today's progress
  const getTodayProgress = (): CalorieProgress => {
    return store.getCalorieProgress(new Date());
  };

  // Get progress for specific date
  const getDateProgress = (date: Date): CalorieProgress => {
    return store.getCalorieProgress(date);
  };

  // Get entries for today
  const getTodayEntries = (): CalorieEntryWithFood[] => {
    return store.getEntriesForDate(new Date());
  };

  // Get entries for specific date
  const getDateEntries = (date: Date): CalorieEntryWithFood[] => {
    return store.getEntriesForDate(date);
  };

  // Food management
  const searchFoods = (query: string): FoodItem[] => {
    return store.searchFoodItems(query);
  };

  const getFoodsByCategory = (category: string): FoodItem[] => {
    return store.getFoodItemsByCategory(category);
  };

  const addCustomFood = async (input: CreateFoodItemInput) => {
    return await store.createFoodItem({ ...input, isCustom: true });
  };

  const updateFood = async (id: string, input: UpdateFoodItemInput) => {
    return await store.updateFoodItem(id, input);
  };

  const deleteFood = async (id: string) => {
    return await store.deleteFoodItem(id);
  };

  // Goal management
  const setGoal = async (input: CreateCalorieGoalInput) => {
    return await store.createCalorieGoal(input);
  };

  const updateGoal = async (id: string, input: UpdateCalorieGoalInput) => {
    return await store.updateCalorieGoal(id, input);
  };

  const getActiveGoal = (): CalorieGoal | undefined => {
    return store.getActiveGoal;
  };

  // Statistics
  const getWeeklyAverage = (): number => {
    return store.getWeeklyAverage;
  };

  const getMonthlyAverage = (): number => {
    return store.getMonthlyAverage;
  };

  // Data management
  const clearAllData = async () => {
    return await store.clearAllData();
  };

  const getError = () => {
    return store.error;
  };

  const clearError = () => {
    store.clearError();
  };

  const isLoading = () => {
    return store.isLoading;
  };

  const isInitialized = () => {
    return store.isInitialized;
  };

  // Bulk operations
  const addMultipleEntries = async (entries: CreateCalorieEntryInput[]) => {
    const results = [];

    for (const entry of entries) {
      try {
        const result = await store.createCalorieEntry(entry);
        results.push(result);
      } catch (error) {
        console.error('Failed to add entry:', error);
        // Continue with other entries
      }
    }

    return results;
  };

  const deleteMultipleEntries = async (ids: string[]) => {
    const results = [];

    for (const id of ids) {
      try {
        await store.deleteCalorieEntry(id);
        results.push(id);
      } catch (error) {
        console.error(`Failed to delete entry ${id}:`, error);
        // Continue with other entries
      }
    }

    return results;
  };

  // Convenience methods
  const duplicateEntry = async (entryId: string, newDate?: Date) => {
    const entry = store.getCalorieEntryById(entryId);
    if (!entry) {
      throw new Error('Entry not found');
    }

    const consumedAt = newDate || new Date();
    const mealType = getMealTypeFromTime(consumedAt);

    const input: CreateCalorieEntryInput = {
      foodId: entry.foodId,
      quantity: entry.quantity,
      mealType,
      consumedAt,
      notes: entry.notes,
    };

    return await store.createCalorieEntry(input);
  };

  const copyYesterdayEntries = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayEntries = store.getEntriesForDate(yesterday);
    const today = new Date();

    const newEntries: CreateCalorieEntryInput[] = yesterdayEntries.map((entry) => ({
      foodId: entry.foodId,
      quantity: entry.quantity,
      mealType: entry.mealType,
      consumedAt: new Date(today.getTime() + (entry.consumedAt.getTime() - yesterday.getTime())),
      notes: entry.notes,
    }));

    return await addMultipleEntries(newEntries);
  };

  // Export computed properties and reactive data
  return {
    // Store state
    foodItems: computed(() => store.foodItems),
    calorieEntries: computed(() => store.calorieEntries),
    calorieGoals: computed(() => store.calorieGoals),
    entriesWithFood: computed(() => store.getEntriesWithFood),

    // Initialization
    initialize,
    isInitialized,
    isLoading,

    // Entry management
    quickAddEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    duplicateEntry,

    // Daily data
    getTodaySummary,
    getDateSummary,
    getTodayProgress,
    getDateProgress,
    getTodayEntries,
    getDateEntries,

    // Food management
    searchFoods,
    getFoodsByCategory,
    addCustomFood,
    updateFood,
    deleteFood,

    // Goal management
    setGoal,
    updateGoal,
    getActiveGoal,

    // Statistics
    getWeeklyAverage,
    getMonthlyAverage,

    // Bulk operations
    addMultipleEntries,
    deleteMultipleEntries,
    copyYesterdayEntries,

    // Utility
    getError,
    clearError,
    clearAllData,
  };
};

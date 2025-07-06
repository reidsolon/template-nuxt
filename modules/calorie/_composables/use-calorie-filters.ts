import { useCalorieStore } from '../_stores/calorie';
import type { CalorieEntryWithFood, CalorieFilter, CalorieSort, FoodItem } from '../_types/calorie';
import { sanitizeSearchQuery, sortEntriesByDateTime } from '../_utils/calorie-helpers';

/**
 * Composable for filtering and searching calorie data
 */
export const useCalorieFilters = () => {
  const store = useCalorieStore();

  // Filter entries based on criteria
  const filterEntries = (entries: CalorieEntryWithFood[], filter: CalorieFilter): CalorieEntryWithFood[] => {
    let filteredEntries = [...entries];

    // Date range filter
    if (filter.dateFrom) {
      filteredEntries = filteredEntries.filter((entry) => entry.consumedAt >= filter.dateFrom!);
    }

    if (filter.dateTo) {
      const endOfDay = new Date(filter.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filteredEntries = filteredEntries.filter((entry) => entry.consumedAt <= endOfDay);
    }

    // Meal type filter
    if (filter.mealType) {
      filteredEntries = filteredEntries.filter((entry) => entry.mealType === filter.mealType);
    }

    // Category filter
    if (filter.category) {
      filteredEntries = filteredEntries.filter((entry) => entry.food.category === filter.category);
    }

    // Search filter
    if (filter.search) {
      const searchTerm = sanitizeSearchQuery(filter.search);
      filteredEntries = filteredEntries.filter(
        (entry) =>
          entry.food.name.toLowerCase().includes(searchTerm) ||
          entry.food.brand?.toLowerCase().includes(searchTerm) ||
          entry.food.category.toLowerCase().includes(searchTerm) ||
          entry.notes?.toLowerCase().includes(searchTerm)
      );
    }

    return filteredEntries;
  };

  // Sort entries
  const sortEntries = (entries: CalorieEntryWithFood[], sort: CalorieSort): CalorieEntryWithFood[] => {
    const sortedEntries = [...entries];

    sortedEntries.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'consumedAt':
          aValue = a.consumedAt.getTime();
          bValue = b.consumedAt.getTime();
          break;
        case 'calories':
          aValue = a.totalCalories;
          bValue = b.totalCalories;
          break;
        case 'name':
          aValue = a.food.name.toLowerCase();
          bValue = b.food.name.toLowerCase();
          break;
        case 'mealType':
          const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
          aValue = mealOrder[a.mealType];
          bValue = mealOrder[b.mealType];
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sortedEntries;
  };

  // Filter and sort entries
  const filterAndSortEntries = (
    entries: CalorieEntryWithFood[],
    filter?: CalorieFilter,
    sort?: CalorieSort
  ): CalorieEntryWithFood[] => {
    let result = entries;

    if (filter) {
      result = filterEntries(result, filter);
    }

    if (sort) {
      result = sortEntries(result, sort);
    } else {
      // Default sort by date and meal type
      result = sortEntriesByDateTime(result);
    }

    return result;
  };

  // Search food items
  const searchFoodItems = (query: string): FoodItem[] => {
    if (!query.trim()) {
      return store.foodItems;
    }

    const searchTerm = sanitizeSearchQuery(query);
    return store.foodItems.filter(
      (food) =>
        food.name.toLowerCase().includes(searchTerm) ||
        food.brand?.toLowerCase().includes(searchTerm) ||
        food.category.toLowerCase().includes(searchTerm)
    );
  };

  // Filter food items by category
  const filterFoodsByCategory = (category: string): FoodItem[] => {
    return store.foodItems.filter((food) => food.category === category);
  };

  // Get entries for date range
  const getEntriesForDateRange = (startDate: Date, endDate: Date): CalorieEntryWithFood[] => {
    return store.getEntriesForDateRange(startDate, endDate);
  };

  // Get entries for current week
  const getCurrentWeekEntries = (): CalorieEntryWithFood[] => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return getEntriesForDateRange(startOfWeek, endOfWeek);
  };

  // Get entries for current month
  const getCurrentMonthEntries = (): CalorieEntryWithFood[] => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return getEntriesForDateRange(startOfMonth, endOfMonth);
  };

  // Get entries by meal type
  const getEntriesByMealType = (mealType: string): CalorieEntryWithFood[] => {
    return store.getEntriesWithFood.filter((entry) => entry.mealType === mealType);
  };

  // Get high calorie entries (above threshold)
  const getHighCalorieEntries = (threshold: number = 300): CalorieEntryWithFood[] => {
    return store.getEntriesWithFood.filter((entry) => entry.totalCalories > threshold);
  };

  // Get recent entries (last N days)
  const getRecentEntries = (days: number = 7): CalorieEntryWithFood[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    return store.getEntriesWithFood.filter((entry) => entry.consumedAt >= cutoffDate);
  };

  // Get most consumed foods
  const getMostConsumedFoods = (limit: number = 10): { food: FoodItem; count: number; totalCalories: number }[] => {
    const foodCounts = new Map<string, { food: FoodItem; count: number; totalCalories: number }>();

    store.getEntriesWithFood.forEach((entry) => {
      const existing = foodCounts.get(entry.foodId);
      if (existing) {
        existing.count += 1;
        existing.totalCalories += entry.totalCalories;
      } else {
        foodCounts.set(entry.foodId, {
          food: entry.food,
          count: 1,
          totalCalories: entry.totalCalories,
        });
      }
    });

    return Array.from(foodCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  // Get entries by food category
  const getEntriesByCategory = (category: string): CalorieEntryWithFood[] => {
    return store.getEntriesWithFood.filter((entry) => entry.food.category === category);
  };

  // Advanced search with multiple criteria
  const advancedSearch = (criteria: {
    query?: string;
    category?: string;
    mealType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    minCalories?: number;
    maxCalories?: number;
  }): CalorieEntryWithFood[] => {
    let entries = store.getEntriesWithFood;

    // Apply filters
    if (criteria.query) {
      const searchTerm = sanitizeSearchQuery(criteria.query);
      entries = entries.filter(
        (entry) =>
          entry.food.name.toLowerCase().includes(searchTerm) ||
          entry.food.brand?.toLowerCase().includes(searchTerm) ||
          entry.notes?.toLowerCase().includes(searchTerm)
      );
    }

    if (criteria.category) {
      entries = entries.filter((entry) => entry.food.category === criteria.category);
    }

    if (criteria.mealType) {
      entries = entries.filter((entry) => entry.mealType === criteria.mealType);
    }

    if (criteria.dateFrom) {
      entries = entries.filter((entry) => entry.consumedAt >= criteria.dateFrom!);
    }

    if (criteria.dateTo) {
      const endOfDay = new Date(criteria.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      entries = entries.filter((entry) => entry.consumedAt <= endOfDay);
    }

    if (criteria.minCalories !== undefined) {
      entries = entries.filter((entry) => entry.totalCalories >= criteria.minCalories!);
    }

    if (criteria.maxCalories !== undefined) {
      entries = entries.filter((entry) => entry.totalCalories <= criteria.maxCalories!);
    }

    return sortEntriesByDateTime(entries);
  };

  // Get food suggestions based on current entries
  const getFoodSuggestions = (limit: number = 5): FoodItem[] => {
    const recentEntries = getRecentEntries(30); // Last 30 days
    const foodFrequency = new Map<string, number>();

    recentEntries.forEach((entry) => {
      const count = foodFrequency.get(entry.foodId) || 0;
      foodFrequency.set(entry.foodId, count + 1);
    });

    const sortedFoods = Array.from(foodFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sortedFoods.map(([foodId]) => store.getFoodItemById(foodId)).filter(Boolean) as FoodItem[];
  };

  return {
    // Core filtering
    filterEntries,
    sortEntries,
    filterAndSortEntries,

    // Food search
    searchFoodItems,
    filterFoodsByCategory,

    // Date-based filters
    getEntriesForDateRange,
    getCurrentWeekEntries,
    getCurrentMonthEntries,
    getRecentEntries,

    // Specialized filters
    getEntriesByMealType,
    getEntriesByCategory,
    getHighCalorieEntries,

    // Analytics
    getMostConsumedFoods,
    getFoodSuggestions,

    // Advanced search
    advancedSearch,
  };
};

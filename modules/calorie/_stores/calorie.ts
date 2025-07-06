import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { useCalorieDummyData } from '../_composables/use-calorie-dummy-data';
import { useCalorieStorage } from '../_composables/use-calorie-storage';
import type {
  CalorieEntry,
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
import {
  CreateCalorieEntrySchema,
  CreateCalorieGoalSchema,
  CreateFoodItemSchema,
  UpdateCalorieEntrySchema,
  UpdateCalorieGoalSchema,
  UpdateFoodItemSchema,
} from '../_types/calorie';
import {
  calculateNutrition,
  formatDate,
  getDayRange,
  isSameDay,
  sortEntriesByDateTime,
  sumNutrition,
} from '../_utils/calorie-helpers';

export const useCalorieStore = defineStore('calorie', {
  state: () => ({
    foodItems: [] as FoodItem[],
    calorieEntries: [] as CalorieEntry[],
    calorieGoals: [] as CalorieGoal[],
    isLoading: false,
    error: null as string | null,
    isInitialized: false,
  }),

  getters: {
    // Food Items
    getFoodItemById:
      (state) =>
      (id: string): FoodItem | undefined => {
        return state.foodItems.find((food) => food.id === id);
      },

    getFoodItemsByCategory: (state) => (category: string) => {
      return state.foodItems.filter((food) => food.category === category);
    },

    searchFoodItems: (state) => (query: string) => {
      const searchTerm = query.toLowerCase();
      return state.foodItems.filter(
        (food) =>
          food.name.toLowerCase().includes(searchTerm) ||
          food.brand?.toLowerCase().includes(searchTerm) ||
          food.category.toLowerCase().includes(searchTerm)
      );
    },

    // Calorie Entries
    getCalorieEntryById:
      (state) =>
      (id: string): CalorieEntry | undefined => {
        return state.calorieEntries.find((entry) => entry.id === id);
      },

    getEntriesWithFood: (state): CalorieEntryWithFood[] => {
      return state.calorieEntries
        .map((entry) => {
          const food = state.foodItems.find((f) => f.id === entry.foodId);
          if (!food) {
            console.warn(`Food item not found for entry ${entry.id}`);
            return null;
          }

          const totalNutrition = calculateNutrition(food.nutrition, entry.quantity);

          return {
            ...entry,
            food,
            totalCalories: totalNutrition.calories,
            totalNutrition,
          };
        })
        .filter(Boolean) as CalorieEntryWithFood[];
    },

    getEntriesForDate:
      (state) =>
      (date: Date): CalorieEntryWithFood[] => {
        const { start, end } = getDayRange(date);
        const entriesWithFood = state.calorieEntries
          .map((entry) => {
            const food = state.foodItems.find((f) => f.id === entry.foodId);
            if (!food) return null;

            const totalNutrition = calculateNutrition(food.nutrition, entry.quantity);
            return {
              ...entry,
              food,
              totalCalories: totalNutrition.calories,
              totalNutrition,
            };
          })
          .filter(Boolean) as CalorieEntryWithFood[];

        return entriesWithFood.filter((entry) => entry.consumedAt >= start && entry.consumedAt <= end);
      },

    getEntriesForDateRange:
      (state) =>
      (startDate: Date, endDate: Date): CalorieEntryWithFood[] => {
        const entriesWithFood = state.calorieEntries
          .map((entry) => {
            const food = state.foodItems.find((f) => f.id === entry.foodId);
            if (!food) return null;

            const totalNutrition = calculateNutrition(food.nutrition, entry.quantity);
            return {
              ...entry,
              food,
              totalCalories: totalNutrition.calories,
              totalNutrition,
            };
          })
          .filter(Boolean) as CalorieEntryWithFood[];

        return entriesWithFood.filter((entry) => entry.consumedAt >= startDate && entry.consumedAt <= endDate);
      },

    // Daily Summary
    getDailySummary:
      (state) =>
      (date: Date): DailySummary => {
        const entries = state.calorieEntries
          .filter((entry) => isSameDay(entry.consumedAt, date))
          .map((entry) => {
            const food = state.foodItems.find((f) => f.id === entry.foodId);
            if (!food) return null;

            const totalNutrition = calculateNutrition(food.nutrition, entry.quantity);
            return {
              ...entry,
              food,
              totalCalories: totalNutrition.calories,
              totalNutrition,
            };
          })
          .filter(Boolean) as CalorieEntryWithFood[];

        const sortedEntries = sortEntriesByDateTime(entries);
        const totalNutrition = sumNutrition(entries.map((e) => e.totalNutrition));

        const mealBreakdown = entries.reduce(
          (breakdown, entry) => {
            breakdown[entry.mealType] += entry.totalCalories;
            return breakdown;
          },
          {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            snack: 0,
          }
        );

        return {
          date: formatDate(date),
          totalCalories: totalNutrition.calories,
          totalNutrition,
          entries: sortedEntries,
          mealBreakdown,
        };
      },

    // Goals
    getActiveGoal: (state): CalorieGoal | undefined => {
      return state.calorieGoals.find((goal) => goal.isActive);
    },

    getCalorieProgress:
      (state) =>
      (date: Date): CalorieProgress => {
        const entries = state.calorieEntries
          .filter((entry) => isSameDay(entry.consumedAt, date))
          .map((entry) => {
            const food = state.foodItems.find((f) => f.id === entry.foodId);
            if (!food) return null;
            const totalNutrition = calculateNutrition(food.nutrition, entry.quantity);
            return totalNutrition.calories;
          })
          .filter(Boolean) as number[];

        const consumed = entries.reduce((sum, calories) => sum + calories, 0);
        const activeGoal = state.calorieGoals.find((goal) => goal.isActive);
        const goal = activeGoal?.dailyCalories || 2000;
        const remaining = Math.max(0, goal - consumed);
        const percentage = goal > 0 ? Math.round((consumed / goal) * 100) : 0;

        return {
          consumed,
          goal,
          remaining,
          percentage,
        };
      },

    // Statistics
    getWeeklyAverage: (state) => {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);

      const entries = state.calorieEntries
        .filter((entry) => entry.consumedAt >= weekAgo && entry.consumedAt <= now)
        .map((entry) => {
          const food = state.foodItems.find((f) => f.id === entry.foodId);
          if (!food) return 0;
          const totalNutrition = calculateNutrition(food.nutrition, entry.quantity);
          return totalNutrition.calories;
        });

      const totalCalories = entries.reduce((sum: number, calories: number) => sum + calories, 0);
      return totalCalories / 7;
    },

    getMonthlyAverage: (state) => {
      const now = new Date();
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);

      const entries = state.calorieEntries
        .filter((entry) => entry.consumedAt >= monthAgo && entry.consumedAt <= now)
        .map((entry) => {
          const food = state.foodItems.find((f) => f.id === entry.foodId);
          if (!food) return 0;
          const totalNutrition = calculateNutrition(food.nutrition, entry.quantity);
          return totalNutrition.calories;
        });

      const totalCalories = entries.reduce((sum: number, calories: number) => sum + calories, 0);
      return totalCalories / 30;
    },
  },

  actions: {
    // Initialization
    async initialize() {
      if (this.isInitialized) return;

      this.isLoading = true;
      this.error = null;

      try {
        const storage = useCalorieStorage();

        // Load data from storage
        this.foodItems = storage.loadFoodItems();
        this.calorieEntries = storage.loadCalorieEntries();
        this.calorieGoals = storage.loadCalorieGoals();

        // If no data exists, initialize with dummy data
        if (this.foodItems.length === 0) {
          await this.initializeDummyData();
        }

        this.isInitialized = true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to initialize';
        console.error('Failed to initialize calorie store:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async initializeDummyData() {
      const dummyData = useCalorieDummyData();
      const { foodItems, calorieEntries, calorieGoals } = dummyData.initializeDummyData();

      this.foodItems = foodItems;
      this.calorieEntries = calorieEntries;
      this.calorieGoals = calorieGoals;

      await this.persistData();
    },

    async persistData() {
      try {
        const storage = useCalorieStorage();
        storage.saveFoodItems(this.foodItems);
        storage.saveCalorieEntries(this.calorieEntries);
        storage.saveCalorieGoals(this.calorieGoals);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to persist data';
        throw error;
      }
    },

    // Food Items CRUD
    async createFoodItem(input: CreateFoodItemInput): Promise<FoodItem> {
      try {
        const validatedInput = CreateFoodItemSchema.parse(input);

        const now = new Date();
        const newFood: FoodItem = {
          ...validatedInput,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };

        this.foodItems.push(newFood);
        await this.persistData();

        return newFood;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create food item';
        throw error;
      }
    },

    async updateFoodItem(id: string, input: UpdateFoodItemInput): Promise<FoodItem> {
      try {
        const validatedInput = UpdateFoodItemSchema.parse(input);

        const index = this.foodItems.findIndex((food) => food.id === id);
        if (index === -1) {
          throw new Error('Food item not found');
        }

        const updatedFood = {
          ...this.foodItems[index],
          ...validatedInput,
          updatedAt: new Date(),
        };

        this.foodItems[index] = updatedFood;
        await this.persistData();

        return updatedFood;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update food item';
        throw error;
      }
    },

    async deleteFoodItem(id: string): Promise<void> {
      try {
        const index = this.foodItems.findIndex((food) => food.id === id);
        if (index === -1) {
          throw new Error('Food item not found');
        }

        // Check if food item is used in any entries
        const isUsed = this.calorieEntries.some((entry) => entry.foodId === id);
        if (isUsed) {
          throw new Error('Cannot delete food item that is used in calorie entries');
        }

        this.foodItems.splice(index, 1);
        await this.persistData();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete food item';
        throw error;
      }
    },

    // Calorie Entries CRUD
    async createCalorieEntry(input: CreateCalorieEntryInput): Promise<CalorieEntry> {
      try {
        const validatedInput = CreateCalorieEntrySchema.parse(input);

        // Validate that food item exists
        const foodExists = this.foodItems.some((food) => food.id === validatedInput.foodId);
        if (!foodExists) {
          throw new Error('Food item not found');
        }

        const now = new Date();
        const newEntry: CalorieEntry = {
          ...validatedInput,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };

        this.calorieEntries.push(newEntry);
        await this.persistData();

        return newEntry;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create calorie entry';
        throw error;
      }
    },

    async updateCalorieEntry(id: string, input: UpdateCalorieEntryInput): Promise<CalorieEntry> {
      try {
        const validatedInput = UpdateCalorieEntrySchema.parse(input);

        const index = this.calorieEntries.findIndex((entry) => entry.id === id);
        if (index === -1) {
          throw new Error('Calorie entry not found');
        }

        // Validate that food item exists if foodId is being updated
        if (validatedInput.foodId) {
          const foodExists = this.foodItems.some((food) => food.id === validatedInput.foodId);
          if (!foodExists) {
            throw new Error('Food item not found');
          }
        }

        const updatedEntry = {
          ...this.calorieEntries[index],
          ...validatedInput,
          updatedAt: new Date(),
        };

        this.calorieEntries[index] = updatedEntry;
        await this.persistData();

        return updatedEntry;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update calorie entry';
        throw error;
      }
    },

    async deleteCalorieEntry(id: string): Promise<void> {
      try {
        const index = this.calorieEntries.findIndex((entry) => entry.id === id);
        if (index === -1) {
          throw new Error('Calorie entry not found');
        }

        this.calorieEntries.splice(index, 1);
        await this.persistData();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete calorie entry';
        throw error;
      }
    },

    // Calorie Goals CRUD
    async createCalorieGoal(input: CreateCalorieGoalInput): Promise<CalorieGoal> {
      try {
        const validatedInput = CreateCalorieGoalSchema.parse(input);

        // Deactivate existing goals if this one is active
        if (validatedInput.isActive) {
          this.calorieGoals.forEach((goal) => {
            goal.isActive = false;
          });
        }

        const now = new Date();
        const newGoal: CalorieGoal = {
          ...validatedInput,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };

        this.calorieGoals.push(newGoal);
        await this.persistData();

        return newGoal;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create calorie goal';
        throw error;
      }
    },

    async updateCalorieGoal(id: string, input: UpdateCalorieGoalInput): Promise<CalorieGoal> {
      try {
        const validatedInput = UpdateCalorieGoalSchema.parse(input);

        const index = this.calorieGoals.findIndex((goal) => goal.id === id);
        if (index === -1) {
          throw new Error('Calorie goal not found');
        }

        // Deactivate other goals if this one is being set to active
        if (validatedInput.isActive) {
          this.calorieGoals.forEach((goal, i) => {
            if (i !== index) {
              goal.isActive = false;
            }
          });
        }

        const updatedGoal = {
          ...this.calorieGoals[index],
          ...validatedInput,
          updatedAt: new Date(),
        };

        this.calorieGoals[index] = updatedGoal;
        await this.persistData();

        return updatedGoal;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update calorie goal';
        throw error;
      }
    },

    async deleteCalorieGoal(id: string): Promise<void> {
      try {
        const index = this.calorieGoals.findIndex((goal) => goal.id === id);
        if (index === -1) {
          throw new Error('Calorie goal not found');
        }

        this.calorieGoals.splice(index, 1);
        await this.persistData();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete calorie goal';
        throw error;
      }
    },

    // Utility actions
    clearError() {
      this.error = null;
    },

    async clearAllData() {
      try {
        const storage = useCalorieStorage();
        await storage.clearAllData();

        this.foodItems = [];
        this.calorieEntries = [];
        this.calorieGoals = [];
        this.isInitialized = false;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to clear data';
        throw error;
      }
    },
  },
});

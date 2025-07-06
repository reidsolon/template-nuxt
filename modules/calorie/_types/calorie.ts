import { z } from 'zod'

// Zod Schemas
export const NutritionInfoSchema = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
})

export const FoodItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Food name is required'),
  brand: z.string().optional(),
  category: z.enum(['fruits', 'vegetables', 'grains', 'proteins', 'dairy', 'snacks', 'beverages', 'other']),
  servingSize: z.string().min(1, 'Serving size is required'),
  servingUnit: z.enum(['g', 'ml', 'cup', 'piece', 'slice', 'tbsp', 'tsp', 'oz']),
  nutrition: NutritionInfoSchema,
  barcode: z.string().optional(),
  isCustom: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CalorieEntrySchema = z.object({
  id: z.string(),
  foodId: z.string(),
  userId: z.string().optional(),
  quantity: z.number().min(0.1, 'Quantity must be greater than 0'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  consumedAt: z.date(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CalorieGoalSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  dailyCalories: z.number().min(800).max(5000),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  activityLevel: z.enum(['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active']),
  goal: z.enum(['lose-weight', 'maintain-weight', 'gain-weight']),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const CalorieFilterSchema = z.object({
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  category: z.enum(['fruits', 'vegetables', 'grains', 'proteins', 'dairy', 'snacks', 'beverages', 'other']).optional(),
  search: z.string().optional(),
})

export const CalorieSortSchema = z.object({
  field: z.enum(['consumedAt', 'calories', 'name', 'mealType']),
  direction: z.enum(['asc', 'desc']),
})

// TypeScript Interfaces (inferred from schemas)
export type NutritionInfo = z.infer<typeof NutritionInfoSchema>
export type FoodItem = z.infer<typeof FoodItemSchema>
export type CalorieEntry = z.infer<typeof CalorieEntrySchema>
export type CalorieGoal = z.infer<typeof CalorieGoalSchema>
export type CalorieFilter = z.infer<typeof CalorieFilterSchema>
export type CalorieSort = z.infer<typeof CalorieSortSchema>

// Input Types
export const CreateFoodItemSchema = FoodItemSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateFoodItemSchema = FoodItemSchema.partial().omit({ id: true, createdAt: true })

export const CreateCalorieEntrySchema = CalorieEntrySchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateCalorieEntrySchema = CalorieEntrySchema.partial().omit({ id: true, createdAt: true })

export const CreateCalorieGoalSchema = CalorieGoalSchema.omit({ id: true, createdAt: true, updatedAt: true })
export const UpdateCalorieGoalSchema = CalorieGoalSchema.partial().omit({ id: true, createdAt: true })

export type CreateFoodItemInput = z.infer<typeof CreateFoodItemSchema>
export type UpdateFoodItemInput = z.infer<typeof UpdateFoodItemSchema>
export type CreateCalorieEntryInput = z.infer<typeof CreateCalorieEntrySchema>
export type UpdateCalorieEntryInput = z.infer<typeof UpdateCalorieEntrySchema>
export type CreateCalorieGoalInput = z.infer<typeof CreateCalorieGoalSchema>
export type UpdateCalorieGoalInput = z.infer<typeof UpdateCalorieGoalSchema>

// Extended types for UI
export interface CalorieEntryWithFood extends CalorieEntry {
  food: FoodItem
  totalCalories: number
  totalNutrition: NutritionInfo
}

export interface DailySummary {
  date: string
  totalCalories: number
  totalNutrition: NutritionInfo
  entries: CalorieEntryWithFood[]
  mealBreakdown: {
    breakfast: number
    lunch: number
    dinner: number
    snack: number
  }
}

export interface CalorieProgress {
  consumed: number
  goal: number
  remaining: number
  percentage: number
}

// Enums for easier use
export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const
export const FOOD_CATEGORIES = ['fruits', 'vegetables', 'grains', 'proteins', 'dairy', 'snacks', 'beverages', 'other'] as const
export const SERVING_UNITS = ['g', 'ml', 'cup', 'piece', 'slice', 'tbsp', 'tsp', 'oz'] as const
export const ACTIVITY_LEVELS = ['sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'] as const
export const GOALS = ['lose-weight', 'maintain-weight', 'gain-weight'] as const

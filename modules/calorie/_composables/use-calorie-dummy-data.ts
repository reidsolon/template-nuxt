import { v4 as uuidv4 } from 'uuid'
import type { FoodItem, CalorieEntry, CalorieGoal } from '../_types/calorie'

/**
 * Composable for managing dummy/sample data
 */
export const useCalorieDummyData = () => {
  
  const createDummyFoodItems = (): FoodItem[] => {
    const now = new Date()
    
    return [
      // Fruits
      {
        id: uuidv4(),
        name: 'Apple',
        category: 'fruits',
        servingSize: '1',
        servingUnit: 'piece',
        nutrition: {
          calories: 95,
          protein: 0.5,
          carbs: 25,
          fat: 0.3,
          fiber: 4,
          sugar: 19,
          sodium: 2
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Banana',
        category: 'fruits',
        servingSize: '1',
        servingUnit: 'piece',
        nutrition: {
          calories: 105,
          protein: 1.3,
          carbs: 27,
          fat: 0.4,
          fiber: 3,
          sugar: 21,
          sodium: 1
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Orange',
        category: 'fruits',
        servingSize: '1',
        servingUnit: 'piece',
        nutrition: {
          calories: 62,
          protein: 1.2,
          carbs: 15,
          fat: 0.2,
          fiber: 3,
          sugar: 12,
          sodium: 0
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      
      // Vegetables
      {
        id: uuidv4(),
        name: 'Broccoli',
        category: 'vegetables',
        servingSize: '100',
        servingUnit: 'g',
        nutrition: {
          calories: 34,
          protein: 2.8,
          carbs: 7,
          fat: 0.4,
          fiber: 2.6,
          sugar: 1.5,
          sodium: 33
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Carrots',
        category: 'vegetables',
        servingSize: '100',
        servingUnit: 'g',
        nutrition: {
          calories: 41,
          protein: 0.9,
          carbs: 10,
          fat: 0.2,
          fiber: 2.8,
          sugar: 4.7,
          sodium: 69
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      
      // Grains
      {
        id: uuidv4(),
        name: 'Brown Rice',
        category: 'grains',
        servingSize: '100',
        servingUnit: 'g',
        nutrition: {
          calories: 111,
          protein: 2.6,
          carbs: 23,
          fat: 0.9,
          fiber: 1.8,
          sugar: 0.4,
          sodium: 5
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Whole Wheat Bread',
        category: 'grains',
        servingSize: '1',
        servingUnit: 'slice',
        nutrition: {
          calories: 81,
          protein: 3.6,
          carbs: 14,
          fat: 1.1,
          fiber: 1.9,
          sugar: 1.4,
          sodium: 144
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      
      // Proteins
      {
        id: uuidv4(),
        name: 'Chicken Breast',
        category: 'proteins',
        servingSize: '100',
        servingUnit: 'g',
        nutrition: {
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          fiber: 0,
          sugar: 0,
          sodium: 74
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Eggs',
        category: 'proteins',
        servingSize: '1',
        servingUnit: 'piece',
        nutrition: {
          calories: 70,
          protein: 6,
          carbs: 0.6,
          fat: 5,
          fiber: 0,
          sugar: 0.6,
          sodium: 70
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Greek Yogurt',
        category: 'dairy',
        servingSize: '100',
        servingUnit: 'g',
        nutrition: {
          calories: 59,
          protein: 10,
          carbs: 3.6,
          fat: 0.4,
          fiber: 0,
          sugar: 3.2,
          sodium: 36
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      
      // Dairy
      {
        id: uuidv4(),
        name: 'Milk (2%)',
        category: 'dairy',
        servingSize: '240',
        servingUnit: 'ml',
        nutrition: {
          calories: 122,
          protein: 8,
          carbs: 12,
          fat: 5,
          fiber: 0,
          sugar: 12,
          sodium: 115
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      
      // Snacks
      {
        id: uuidv4(),
        name: 'Almonds',
        category: 'snacks',
        servingSize: '28',
        servingUnit: 'g',
        nutrition: {
          calories: 161,
          protein: 6,
          carbs: 6,
          fat: 14,
          fiber: 3.5,
          sugar: 1.2,
          sodium: 0
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      
      // Beverages
      {
        id: uuidv4(),
        name: 'Water',
        category: 'beverages',
        servingSize: '240',
        servingUnit: 'ml',
        nutrition: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Green Tea',
        category: 'beverages',
        servingSize: '240',
        servingUnit: 'ml',
        nutrition: {
          calories: 2,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 2
        },
        isCustom: false,
        createdAt: now,
        updatedAt: now
      }
    ]
  }

  const createDummyCalorieEntries = (foodItems: FoodItem[]): CalorieEntry[] => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    
    const entries: CalorieEntry[] = []
    
    // Today's entries
    const todayBreakfast = new Date(now)
    todayBreakfast.setHours(8, 0, 0, 0)
    
    const todayLunch = new Date(now)
    todayLunch.setHours(12, 30, 0, 0)
    
    const todayDinner = new Date(now)
    todayDinner.setHours(19, 0, 0, 0)
    
    // Yesterday's entries
    const yesterdayBreakfast = new Date(yesterday)
    yesterdayBreakfast.setHours(8, 30, 0, 0)
    
    const yesterdayLunch = new Date(yesterday)
    yesterdayLunch.setHours(13, 0, 0, 0)
    
    const yesterdayDinner = new Date(yesterday)
    yesterdayDinner.setHours(18, 30, 0, 0)

    // Sample entries
    const sampleEntries = [
      // Today
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Eggs')?.id || foodItems[0].id,
        quantity: 2,
        mealType: 'breakfast' as const,
        consumedAt: todayBreakfast,
        notes: 'Scrambled with vegetables',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Whole Wheat Bread')?.id || foodItems[1].id,
        quantity: 2,
        mealType: 'breakfast' as const,
        consumedAt: todayBreakfast,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Chicken Breast')?.id || foodItems[2].id,
        quantity: 1.5,
        mealType: 'lunch' as const,
        consumedAt: todayLunch,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Brown Rice')?.id || foodItems[3].id,
        quantity: 1,
        mealType: 'lunch' as const,
        consumedAt: todayLunch,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Broccoli')?.id || foodItems[4].id,
        quantity: 1,
        mealType: 'lunch' as const,
        consumedAt: todayLunch,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Apple')?.id || foodItems[5].id,
        quantity: 1,
        mealType: 'snack' as const,
        consumedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: now,
        updatedAt: now
      },
      
      // Yesterday
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Greek Yogurt')?.id || foodItems[6].id,
        quantity: 1,
        mealType: 'breakfast' as const,
        consumedAt: yesterdayBreakfast,
        createdAt: yesterday,
        updatedAt: yesterday
      },
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Banana')?.id || foodItems[7].id,
        quantity: 1,
        mealType: 'breakfast' as const,
        consumedAt: yesterdayBreakfast,
        createdAt: yesterday,
        updatedAt: yesterday
      },
      {
        id: uuidv4(),
        foodId: foodItems.find(f => f.name === 'Almonds')?.id || foodItems[8].id,
        quantity: 1,
        mealType: 'snack' as const,
        consumedAt: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000), // 10 AM yesterday
        createdAt: yesterday,
        updatedAt: yesterday
      }
    ]

    return sampleEntries
  }

  const createDummyCalorieGoals = (): CalorieGoal[] => {
    const now = new Date()
    
    return [
      {
        id: uuidv4(),
        dailyCalories: 2000,
        protein: 150,
        carbs: 250,
        fat: 67,
        activityLevel: 'moderately-active',
        goal: 'maintain-weight',
        isActive: true,
        createdAt: now,
        updatedAt: now
      }
    ]
  }

  const initializeDummyData = (): { 
    foodItems: FoodItem[], 
    calorieEntries: CalorieEntry[], 
    calorieGoals: CalorieGoal[] 
  } => {
    const foodItems = createDummyFoodItems()
    const calorieEntries = createDummyCalorieEntries(foodItems)
    const calorieGoals = createDummyCalorieGoals()
    
    return {
      foodItems,
      calorieEntries,
      calorieGoals
    }
  }

  return {
    createDummyFoodItems,
    createDummyCalorieEntries,
    createDummyCalorieGoals,
    initializeDummyData
  }
}

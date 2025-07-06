import type { CalorieEntryWithFood, NutritionInfo } from '../_types/calorie';

/**
 * Calculate total calories for a given quantity
 */
export const calculateCalories = (baseCalories: number, quantity: number): number => {
  return Math.round(baseCalories * quantity * 100) / 100;
};

/**
 * Calculate total nutrition for a given quantity
 */
export const calculateNutrition = (baseNutrition: NutritionInfo, quantity: number): NutritionInfo => {
  return {
    calories: calculateCalories(baseNutrition.calories, quantity),
    protein: baseNutrition.protein ? Math.round(baseNutrition.protein * quantity * 100) / 100 : undefined,
    carbs: baseNutrition.carbs ? Math.round(baseNutrition.carbs * quantity * 100) / 100 : undefined,
    fat: baseNutrition.fat ? Math.round(baseNutrition.fat * quantity * 100) / 100 : undefined,
    fiber: baseNutrition.fiber ? Math.round(baseNutrition.fiber * quantity * 100) / 100 : undefined,
    sugar: baseNutrition.sugar ? Math.round(baseNutrition.sugar * quantity * 100) / 100 : undefined,
    sodium: baseNutrition.sodium ? Math.round(baseNutrition.sodium * quantity * 100) / 100 : undefined,
  };
};

/**
 * Sum nutrition values from multiple entries
 */
export const sumNutrition = (nutritionArray: NutritionInfo[]): NutritionInfo => {
  return nutritionArray.reduce(
    (total, nutrition) => ({
      calories: Math.round((total.calories + nutrition.calories) * 100) / 100,
      protein:
        total.protein && nutrition.protein
          ? Math.round((total.protein + nutrition.protein) * 100) / 100
          : total.protein || nutrition.protein,
      carbs:
        total.carbs && nutrition.carbs
          ? Math.round((total.carbs + nutrition.carbs) * 100) / 100
          : total.carbs || nutrition.carbs,
      fat:
        total.fat && nutrition.fat ? Math.round((total.fat + nutrition.fat) * 100) / 100 : total.fat || nutrition.fat,
      fiber:
        total.fiber && nutrition.fiber
          ? Math.round((total.fiber + nutrition.fiber) * 100) / 100
          : total.fiber || nutrition.fiber,
      sugar:
        total.sugar && nutrition.sugar
          ? Math.round((total.sugar + nutrition.sugar) * 100) / 100
          : total.sugar || nutrition.sugar,
      sodium:
        total.sodium && nutrition.sodium
          ? Math.round((total.sodium + nutrition.sodium) * 100) / 100
          : total.sodium || nutrition.sodium,
    }),
    { calories: 0 }
  );
};

/**
 * Format date to YYYY-MM-DD string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get start and end of day for a given date
 */
export const getDayRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/**
 * Get dates for the current week
 */
export const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }

  return weekDates;
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2);
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
 */
export const calculateBMR = (
  weight: number, // kg
  height: number, // cm
  age: number,
  sex: 'male' | 'female'
): number => {
  const bmr = 10 * weight + 6.25 * height - 5 * age;
  return sex === 'male' ? bmr + 5 : bmr - 161;
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export const calculateTDEE = (
  bmr: number,
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active'
): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'very-active': 1.725,
    'extremely-active': 1.9,
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
};

/**
 * Calculate recommended calories based on goal
 */
export const calculateCalorieGoal = (tdee: number, goal: 'lose-weight' | 'maintain-weight' | 'gain-weight'): number => {
  const goalAdjustments = {
    'lose-weight': -500, // 1 lb per week
    'maintain-weight': 0,
    'gain-weight': 500, // 1 lb per week
  };

  return Math.round(tdee + goalAdjustments[goal]);
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (current: number, goal: number): number => {
  if (goal === 0) return 0;
  return Math.round((current / goal) * 100);
};

/**
 * Get meal type based on time
 */
export const getMealTypeFromTime = (date: Date): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
  const hour = date.getHours();

  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 21) return 'dinner';
  return 'snack';
};

/**
 * Validate and sanitize search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '');
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Round to specified decimal places
 */
export const roundToDecimal = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Format nutrition value for display
 */
export const formatNutritionValue = (value: number | undefined, unit: string): string => {
  if (value === undefined) return '-';
  return `${roundToDecimal(value)}${unit}`;
};

/**
 * Get color based on progress percentage
 */
export const getProgressColor = (percentage: number): string => {
  if (percentage < 50) return 'text-red-500';
  if (percentage < 85) return 'text-yellow-500';
  if (percentage <= 100) return 'text-green-500';
  return 'text-orange-500';
};

/**
 * Sort entries by date and meal type
 */
export const sortEntriesByDateTime = (entries: CalorieEntryWithFood[]): CalorieEntryWithFood[] => {
  const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };

  return entries.sort((a, b) => {
    const dateCompare = b.consumedAt.getTime() - a.consumedAt.getTime();
    if (dateCompare !== 0) return dateCompare;

    return mealOrder[a.mealType] - mealOrder[b.mealType];
  });
};

import Meal from "../models/Meal.js";

export const DEFAULT_MEALS = [
  { name: "Breakfast", order: 1 },
  { name: "Lunch", order: 2 },
  { name: "Snacks", order: 3 },
  { name: "Dinner", order: 4 },
];

const DEFAULT_MEAL_NAMES = DEFAULT_MEALS.map((meal) => meal.name);

export function getDayRange(dateInput) {
  const dateSearch = new Date(dateInput);

  if (Number.isNaN(dateSearch.getTime())) {
    throw new Error("Invalid date");
  }

  const dateStart = new Date(dateSearch);
  dateStart.setUTCHours(0, 0, 0, 0);

  const dateEnd = new Date(dateSearch);
  dateEnd.setUTCHours(23, 59, 59, 999);

  const anchor = new Date(dateStart);
  anchor.setUTCHours(12, 0, 0, 0);

  return { dateStart, dateEnd, anchor };
}

/**
 * Garante as 4 refeições padrão para o usuário na data informada.
 * Idempotente: só cria as que ainda não existem nesse dia.
 */
export async function ensureDefaultMealsForDate(
  userObjectId,
  dateInput = new Date(),
) {
  const { dateStart, dateEnd, anchor } = getDayRange(dateInput);

  const existing = await Meal.find({
    userId: userObjectId,
    date: { $gte: dateStart, $lte: dateEnd },
    name: { $in: DEFAULT_MEAL_NAMES },
  })
    .select("name")
    .lean();

  const existingNames = new Set(existing.map((meal) => meal.name));
  const missing = DEFAULT_MEALS.filter((meal) => !existingNames.has(meal.name));

  if (missing.length === 0) {
    return [];
  }

  const mealsToCreate = missing.map((meal) => ({
    name: meal.name,
    order: meal.order,
    userId: userObjectId,
    date: anchor,
    items: [],
  }));

  return Meal.insertMany(mealsToCreate);
}

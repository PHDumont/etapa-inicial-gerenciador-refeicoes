import axios from "axios";
import type { Food } from "../App";

export type FoodSearchResult = Omit<Food, "_id"> & { _id?: string };

export async function searchFoods(query: string): Promise<FoodSearchResult[]> {
  const term = query.trim();
  if (!term) return [];

  const { data } = await axios.get<FoodSearchResult[]>("/foods/search/external", {
    params: { query: term },
  });

  return data;
}

export async function ensureFoodId(food: FoodSearchResult): Promise<string> {
  if (food._id) return food._id;

  const { data } = await axios.post<Food>("/foods", {
    name: food.name,
    category: food.category,
    kcalPer100g: food.kcalPer100g,
    proteinPer100g: food.proteinPer100g ?? 0,
    carbohydratesPer100g: food.carbohydratesPer100g ?? 0,
    fatPer100g: food.fatPer100g ?? 0,
    fiberPer100g: food.fiberPer100g ?? 0,
    sugarPer100g: food.sugarPer100g ?? 0,
    sodiumPer100g: food.sodiumPer100g ?? 0,
    barcode: food.barcode,
    source: "user",
  });

  return data._id;
}

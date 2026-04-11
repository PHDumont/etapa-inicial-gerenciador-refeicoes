import { describe, expect, it } from "vitest";
import mealController from "../src/app/controllers/MealController.js";

describe("MealController.calculateTotalCalories (regra de negócio)", () => {
  it("soma calorias com foodId populado (caloriesPerGram × gramas)", () => {
    const meal = {
      items: [
        {
          foodId: { caloriesPerGram: 0.5 },
          quantityGrams: 200,
        },
      ],
      totalCalories: 999,
    };

    mealController.calculateTotalCalories(meal);

    expect(meal.totalCalories).toBe(100);
  });

  it("ignora itens sem food populado ou sem caloriesPerGram numérico", () => {
    const meal = {
      items: [
        { foodId: "507f1f77bcf86cd799439011", quantityGrams: 100 },
        { foodId: { name: "x" }, quantityGrams: 50 },
        { foodId: { caloriesPerGram: 2 }, quantityGrams: 10 },
      ],
      totalCalories: 0,
    };

    mealController.calculateTotalCalories(meal);

    expect(meal.totalCalories).toBe(20);
  });

  it("caso limite: lista de itens vazia zera o total", () => {
    const meal = { items: [], totalCalories: 50 };
    mealController.calculateTotalCalories(meal);
    expect(meal.totalCalories).toBe(0);
  });
});

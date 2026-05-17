export function lineItemKcal(quantityGrams: number, kcalPer100g: number): number {
  return (kcalPer100g / 100) * quantityGrams;
}

export function formatLineItemKcal(
  quantityGrams: number,
  kcalPer100g: number,
): string {
  return lineItemKcal(quantityGrams, kcalPer100g).toFixed(1);
}

export type FoodFormResult =
  | {
      ok: true;
      data: { name: string; category: string; caloriesPerGram: number };
    }
  | { ok: false; reason: "EMPTY_FIELDS" | "INVALID_CALORIES" };

export function parseNewFoodForm(
  name: string,
  category: string,
  calories: number | "",
): FoodFormResult {
  if (!name.trim() || !category.trim() || calories === "") {
    return { ok: false, reason: "EMPTY_FIELDS" };
  }
  const n = Number(calories);
  if (!Number.isFinite(n) || n < 0) {
    return { ok: false, reason: "INVALID_CALORIES" };
  }
  return {
    ok: true,
    data: {
      name: name.trim(),
      category,
      caloriesPerGram: n,
    },
  };
}

export type MealBlockInput = {
  foodId: string;
  quantityGrams: string | number;
};

export type ParseMealPayloadResult =
  | {
      ok: true;
      items: { foodId: string; quantityGrams: number }[];
    }
  | {
      ok: false;
      reason: "EMPTY_NAME" | "NO_ITEMS" | "INVALID_QUANTITY";
    };

export function parseMealPayload(
  name: string,
  blocks: MealBlockInput[],
): ParseMealPayloadResult {
  if (!name.trim()) {
    return { ok: false, reason: "EMPTY_NAME" };
  }

  const filled = blocks.filter(
    (b) =>
      String(b.foodId).trim() !== "" &&
      String(b.quantityGrams).trim() !== "",
  );

  if (filled.length === 0) {
    return { ok: false, reason: "NO_ITEMS" };
  }

  const items: { foodId: string; quantityGrams: number }[] = [];

  for (const b of filled) {
    const raw =
      typeof b.quantityGrams === "number"
        ? b.quantityGrams
        : Number(String(b.quantityGrams).trim().replace(",", "."));
    if (!Number.isFinite(raw) || raw < 1) {
      return { ok: false, reason: "INVALID_QUANTITY" };
    }
    items.push({ foodId: String(b.foodId).trim(), quantityGrams: raw });
  }

  return { ok: true, items };
}

export function filterMealsByName<T extends { name: string }>(
  meals: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return meals;
  return meals.filter((m) => m.name.toLowerCase().includes(q));
}

export function lineItemKcal(quantityGrams: number, kcalPer100g: number): number {
  return (kcalPer100g / 100) * quantityGrams;
}

export function formatLineItemKcal(
  quantityGrams: number,
  kcalPer100g: number,
): string {
  return lineItemKcal(quantityGrams, kcalPer100g).toFixed(1);
}

export type FoodFormNumericField =
  | "kcalPer100g"
  | "proteinPer100g"
  | "carbohydratesPer100g"
  | "fatPer100g"
  | "fiberPer100g"
  | "sugarPer100g"
  | "sodiumPer100g";

export type FoodFormInput = {
  name: string;
  category: string;
  kcalPer100g: number | "";
  proteinPer100g: number | "";
  carbohydratesPer100g: number | "";
  fatPer100g: number | "";
  fiberPer100g: number | "";
  sugarPer100g: number | "";
  sodiumPer100g: number | "";
};

export type ParsedFoodFormData = {
  name: string;
  category: string;
  kcalPer100g: number;
  proteinPer100g: number;
  carbohydratesPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  sugarPer100g: number;
  sodiumPer100g: number;
};

export type FoodFormResult =
  | { ok: true; data: ParsedFoodFormData }
  | { ok: false; reason: "EMPTY_FIELDS" | "INVALID_NUMERIC" };

function parseRequiredNumber(value: number | ""): number | null {
  if (value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function parseFoodForm(input: FoodFormInput): FoodFormResult {
  if (!input.name.trim() || !input.category.trim()) {
    return { ok: false, reason: "EMPTY_FIELDS" };
  }

  const numericFields: FoodFormNumericField[] = [
    "kcalPer100g",
    "proteinPer100g",
    "carbohydratesPer100g",
    "fatPer100g",
    "fiberPer100g",
    "sugarPer100g",
    "sodiumPer100g",
  ];

  const parsed: Partial<Record<FoodFormNumericField, number>> = {};

  for (const field of numericFields) {
    const value = parseRequiredNumber(input[field]);
    if (value === null) {
      return { ok: false, reason: "INVALID_NUMERIC" };
    }
    parsed[field] = value;
  }

  return {
    ok: true,
    data: {
      name: input.name.trim(),
      category: input.category,
      kcalPer100g: parsed.kcalPer100g!,
      proteinPer100g: parsed.proteinPer100g!,
      carbohydratesPer100g: parsed.carbohydratesPer100g!,
      fatPer100g: parsed.fatPer100g!,
      fiberPer100g: parsed.fiberPer100g!,
      sugarPer100g: parsed.sugarPer100g!,
      sodiumPer100g: parsed.sodiumPer100g!,
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

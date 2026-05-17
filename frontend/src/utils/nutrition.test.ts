import { describe, expect, it } from "vitest";
import {
  filterMealsByName,
  formatLineItemKcal,
  lineItemKcal,
  parseFoodForm,
  parseMealPayload,
} from "./nutrition";

const validFormInput = {
  name: "Arroz",
  category: "Grains",
  kcalPer100g: 130,
  proteinPer100g: 2.7,
  carbohydratesPer100g: 28,
  fatPer100g: 0.3,
  fiberPer100g: 0.4,
  sugarPer100g: 0.1,
  sodiumPer100g: 1,
};

describe("lineItemKcal / formatLineItemKcal (cálculo central)", () => {
  it("calcula kcal da linha (kcalPer100g × gramas / 100)", () => {
    expect(lineItemKcal(100, 150)).toBe(150);
    expect(formatLineItemKcal(100, 150)).toBe("150.0");
  });

  it("caso limite: zero gramas resulta em zero kcal", () => {
    expect(lineItemKcal(0, 200)).toBe(0);
    expect(formatLineItemKcal(0, 200)).toBe("0.0");
  });
});

describe("parseFoodForm (validação / cadastro)", () => {
  it("aceita dados válidos", () => {
    const result = parseFoodForm(validFormInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        name: "Arroz",
        category: "Grains",
        kcalPer100g: 130,
        proteinPer100g: 2.7,
        carbohydratesPer100g: 28,
        fatPer100g: 0.3,
        fiberPer100g: 0.4,
        sugarPer100g: 0.1,
        sodiumPer100g: 1,
      });
    }
  });

  it("entrada inválida: campos vazios", () => {
    expect(parseFoodForm({ ...validFormInput, name: "" })).toEqual({
      ok: false,
      reason: "EMPTY_FIELDS",
    });
    expect(parseFoodForm({ ...validFormInput, category: "" })).toEqual({
      ok: false,
      reason: "EMPTY_FIELDS",
    });
  });

  it("entrada inválida: valores numéricos inválidos", () => {
    expect(parseFoodForm({ ...validFormInput, kcalPer100g: -1 })).toEqual({
      ok: false,
      reason: "INVALID_NUMERIC",
    });
    expect(parseFoodForm({ ...validFormInput, proteinPer100g: "" })).toEqual({
      ok: false,
      reason: "INVALID_NUMERIC",
    });
    expect(parseFoodForm({ ...validFormInput, sodiumPer100g: Number.NaN })).toEqual(
      {
        ok: false,
        reason: "INVALID_NUMERIC",
      },
    );
  });

  it("normaliza espaços no nome", () => {
    const result = parseFoodForm({ ...validFormInput, name: "  Feijão  " });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.name).toBe("Feijão");
  });
});

describe("parseMealPayload (refeição / listagem lógica)", () => {
  it("monta itens a partir dos blocos preenchidos", () => {
    const result = parseMealPayload("Almoço", [
      { foodId: "abc", quantityGrams: "100" },
      { foodId: "", quantityGrams: "" },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.items).toEqual([{ foodId: "abc", quantityGrams: 100 }]);
    }
  });

  it("entrada inválida: nome vazio", () => {
    expect(parseMealPayload("   ", [{ foodId: "a", quantityGrams: "10" }])).toEqual({
      ok: false,
      reason: "EMPTY_NAME",
    });
  });

  it("entrada inválida: nenhum item válido", () => {
    expect(
      parseMealPayload("Jantar", [
        { foodId: "", quantityGrams: "10" },
        { foodId: "x", quantityGrams: "" },
      ]),
    ).toEqual({ ok: false, reason: "NO_ITEMS" });
  });

  it("caso limite: quantidade zero ou menor que 1 g", () => {
    expect(
      parseMealPayload("X", [{ foodId: "a", quantityGrams: "0" }]),
    ).toEqual({ ok: false, reason: "INVALID_QUANTITY" });
    expect(
      parseMealPayload("X", [{ foodId: "a", quantityGrams: 0.5 }]),
    ).toEqual({ ok: false, reason: "INVALID_QUANTITY" });
  });

  it("aceita vírgula decimal", () => {
    const result = parseMealPayload("X", [{ foodId: "a", quantityGrams: "10,5" }]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.items[0].quantityGrams).toBe(10.5);
  });
});

describe("filterMealsByName (busca no diário)", () => {
  const meals = [
    { _id: "1", name: "Café da Manhã" },
    { _id: "2", name: "Almoço Executivo" },
  ];

  it("sem query retorna todas as refeições", () => {
    expect(filterMealsByName(meals, "")).toEqual(meals);
    expect(filterMealsByName(meals, "   ")).toEqual(meals);
  });

  it("filtra por substring case insensitive", () => {
    expect(filterMealsByName(meals, "almoço")).toEqual([meals[1]]);
    expect(filterMealsByName(meals, "CAFÉ")).toEqual([meals[0]]);
  });

  it("caso limite: nenhuma correspondência", () => {
    expect(filterMealsByName(meals, "jantar")).toEqual([]);
  });
});

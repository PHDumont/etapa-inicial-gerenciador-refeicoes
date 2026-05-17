import { describe, expect, it } from "vitest";
import {
  filterMealsByName,
  formatLineItemKcal,
  lineItemKcal,
  parseMealPayload,
  parseNewFoodForm,
} from "./nutrition";

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

describe("parseNewFoodForm (validação / cadastro)", () => {
  it("aceita dados válidos", () => {
    const r = parseNewFoodForm("Arroz", "Grains", 1.2);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data).toEqual({
        name: "Arroz",
        category: "Grains",
        caloriesPerGram: 1.2,
      });
    }
  });

  it("entrada inválida: campos vazios", () => {
    expect(parseNewFoodForm("", "Grains", 1)).toEqual({
      ok: false,
      reason: "EMPTY_FIELDS",
    });
    expect(parseNewFoodForm("x", "", 1)).toEqual({
      ok: false,
      reason: "EMPTY_FIELDS",
    });
    expect(parseNewFoodForm("x", "Fruits", "")).toEqual({
      ok: false,
      reason: "EMPTY_FIELDS",
    });
  });

  it("entrada inválida: calorias negativas ou não numéricas", () => {
    expect(parseNewFoodForm("x", "Fruits", -1)).toEqual({
      ok: false,
      reason: "INVALID_CALORIES",
    });
    expect(parseNewFoodForm("x", "Fruits", Number.NaN)).toEqual({
      ok: false,
      reason: "INVALID_CALORIES",
    });
  });

  it("normaliza espaços no nome", () => {
    const r = parseNewFoodForm("  Feijão  ", "Grains", 0);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.name).toBe("Feijão");
  });
});

describe("parseMealPayload (refeição / listagem lógica)", () => {
  it("monta itens a partir dos blocos preenchidos", () => {
    const r = parseMealPayload("Almoço", [
      { foodId: "abc", quantityGrams: "100" },
      { foodId: "", quantityGrams: "" },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.items).toEqual([{ foodId: "abc", quantityGrams: 100 }]);
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
    const r = parseMealPayload("X", [{ foodId: "a", quantityGrams: "10,5" }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.items[0].quantityGrams).toBe(10.5);
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

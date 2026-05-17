import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ensureFoodId, searchFoods } from "./foodSearch";

vi.mock("axios");

describe("foodSearch", () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockReset();
    vi.mocked(axios.post).mockReset();
  });

  it("searchFoods retorna vazio para query em branco", async () => {
    const result = await searchFoods("   ");
    expect(result).toEqual([]);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("searchFoods chama a busca híbrida", async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: [
        {
          _id: "1",
          name: "Apple",
          category: "Fruits",
          kcalPer100g: 52,
          source: "default",
        },
      ],
    });

    const result = await searchFoods("apple");

    expect(axios.get).toHaveBeenCalledWith("/foods/search/external", {
      params: { query: "apple" },
    });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Apple");
  });

  it("ensureFoodId reutiliza _id quando o alimento já existe", async () => {
    const id = await ensureFoodId({
      _id: "507f1f77bcf86cd799439011",
      name: "Apple",
      category: "Fruits",
      kcalPer100g: 52,
    });

    expect(id).toBe("507f1f77bcf86cd799439011");
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("ensureFoodId cadastra alimento externo sem _id", async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: { _id: "new-food-id", name: "External", category: "Grains", kcalPer100g: 100 },
    });

    const id = await ensureFoodId({
      name: "External",
      category: "Grains",
      kcalPer100g: 100,
      proteinPer100g: 1,
      carbohydratesPer100g: 2,
      fatPer100g: 3,
      fiberPer100g: 4,
      sugarPer100g: 5,
      sodiumPer100g: 6,
      source: "open-food-facts",
    });

    expect(id).toBe("new-food-id");
    expect(axios.post).toHaveBeenCalledWith("/foods", expect.objectContaining({
      name: "External",
      source: "user",
    }));
  });
});

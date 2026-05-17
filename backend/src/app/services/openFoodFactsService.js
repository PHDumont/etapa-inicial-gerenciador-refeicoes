const BASE_URL = "https://world.openfoodfacts.org";

const OFF_CATEGORY_RULES = [
  { pattern: /meat|poultry|fish|seafood|egg|protein/i, category: "Proteins" },
  { pattern: /fruit/i, category: "Fruits" },
  { pattern: /vegetable/i, category: "Vegetables" },
  { pattern: /dairy|milk|cheese|yogurt/i, category: "Dairy" },
  { pattern: /beverage|drink|juice|soda|coffee|tea/i, category: "Beverages" },
  { pattern: /sweet|chocolate|candy|dessert|biscuit/i, category: "Sweets" },
  { pattern: /bread|pasta|rice|cereal|grain|legume|bean/i, category: "Grains" },
  { pattern: /carbohydrate|starch|potato/i, category: "Carbohydrates" },
];

class OpenFoodFactsService {
  inferCategory(product) {
    const tags = [
      ...(product.categories_tags || []),
      ...(product.categories || "").split(","),
      product.main_category || "",
    ]
      .join(" ")
      .toLowerCase();

    for (const { pattern, category } of OFF_CATEGORY_RULES) {
      if (pattern.test(tags)) {
        return category;
      }
    }

    return "Grains";
  }

  toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  mapToFoodSchema(product) {
    const nutriments = product.nutriments || {};
    const name = product.product_name?.trim();

    if (!name) {
      return null;
    }

    const food = {
      name,
      category: this.inferCategory(product),
      kcalPer100g: this.toNumber(nutriments["energy-kcal_100g"]),
      proteinPer100g: this.toNumber(nutriments.proteins_100g),
      carbohydratesPer100g: this.toNumber(nutriments.carbohydrates_100g),
      fatPer100g: this.toNumber(nutriments.fat_100g),
      fiberPer100g: this.toNumber(nutriments.fiber_100g),
      sugarPer100g: this.toNumber(nutriments.sugars_100g),
      sodiumPer100g: this.toNumber(nutriments.sodium_100g) * 1000,
      source: "open-food-facts",
    };

    if (product.code) {
      food.barcode = String(product.code);
    }

    return food;
  }

  async fetchWithRetry(url, options = {}, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();

        const timeout = setTimeout(() => {
          controller.abort();
        }, 5000);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            "User-Agent": "MealApp/1.0",
            ...(options.headers || {}),
          },
        });

        clearTimeout(timeout);

        if (response.ok) {
          return response;
        }

        if (
          response.status !== 503 &&
          response.status !== 502 &&
          response.status !== 504
        ) {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }

    throw new Error("Max retries exceeded");
  }

  async search(query, pageSize = 10) {
    const url =
      `${BASE_URL}/cgi/search.pl` +
      `?search_terms=${encodeURIComponent(query)}` +
      `&search_simple=1` +
      `&action=process` +
      `&json=1` +
      `&page_size=${pageSize}`;

    const response = await this.fetchWithRetry(url);
    const data = await response.json();

    return (data.products || [])
      .map((product) => this.mapToFoodSchema(product))
      .filter(Boolean);
  }
}

export default new OpenFoodFactsService();

const BASE_URL = "https://world.openfoodfacts.org";

class OpenFoodFactsService {
  normalize(product) {
    const nutriments = product.nutriments || {};

    return {
      externalId: product.code || null,
      barcode: product.code || null,

      name: product.product_name || null,

      brand: product.brands || null,

      kcalPer100g: nutriments["energy-kcal_100g"] || 0,

      proteinPer100g: nutriments.proteins_100g || 0,

      carbPer100g: nutriments.carbohydrates_100g || 0,

      fatPer100g: nutriments.fat_100g || 0,

      fiberPer100g: nutriments.fiber_100g || 0,

      sugarPer100g: nutriments.sugars_100g || 0,

      sodiumPer100g: (nutriments.sodium_100g || 0) * 1000,
    };
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

  async search(query) {
    const url =
      `${BASE_URL}/cgi/search.pl` +
      `?search_terms=${encodeURIComponent(query)}` +
      `&search_simple=1` +
      `&action=process` +
      `&json=1` +
      `&page_size=20` +
      `&sort_by=unique_scans_n` +
      `&fields=code,product_name,brands,nutriments`;

    const response = await this.fetchWithRetry(url);

    const data = await response.json();

    return (data.products || [])
      .map((product) => this.normalize(product))
      .filter((food) => food.name);
  }
}

export default new OpenFoodFactsService();

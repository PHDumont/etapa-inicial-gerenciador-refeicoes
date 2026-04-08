import type { Food } from "./FoodCatalogy";

interface FoodCardProps {
  food: Food
}

const translateCategory: Record<string, string> = {
  Proteins: "Proteínas",
  Carbohydrates: "Carboidratos",
  Vegetables: "Vegetais",
  Fruits: "Frutas",
  Dairy: "Laticínios",
  Beverages: "Bebidas",
  Sweets: "Doces",
  Grains: "Grãos"
};

export function FoodCard({food}: FoodCardProps) {
  return (
    <div className="food-card">
      <h3>{food.name}</h3>
      <p>{food.caloriesPerGram} kcal/g</p>
      <p>{translateCategory[food.category]}</p>
    </div>
  );
}

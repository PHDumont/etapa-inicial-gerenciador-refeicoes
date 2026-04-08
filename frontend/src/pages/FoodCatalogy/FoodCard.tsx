import type { Food } from "./FoodCatalogy";

import pencil from "../../assets/pencil.png"
import trash from "../../assets/trash.png"
import type React from "react";

interface FoodCardProps {
  food: Food;
  setEditFood: React.Dispatch<React.SetStateAction<Food | null>>
  setIsEditFoodModalOpen: React.Dispatch<React.SetStateAction<true | false>>
  deleteFood: (id: string) => Promise<void>
}

const translateCategory: Record<string, string> = {
  Proteins: "Proteínas",
  Carbohydrates: "Carboidratos",
  Vegetables: "Vegetais",
  Fruits: "Frutas",
  Dairy: "Laticínios",
  Beverages: "Bebidas",
  Sweets: "Doces",
  Grains: "Grãos",
};

export function FoodCard({ food, setEditFood, setIsEditFoodModalOpen, deleteFood }: FoodCardProps) {

  function handleEdit(){
    setEditFood(food)
    setIsEditFoodModalOpen(true)
  }

  function handleDelete(){
    if(window.confirm('Tem certeza que deseja excluir?')){
      deleteFood(food._id)
    }
  }

  return (
    <div className="food-card">
      <h3>{food.name}</h3>
      <p>{food.caloriesPerGram} kcal/g</p>
      <p>{translateCategory[food.category]}</p>
      <div className="card-actions">
        <button className="icon-btn" onClick={handleEdit}><img className="icon" src={pencil} alt="" /></button>
        <button className="icon-btn" onClick={handleDelete}><img className="icon" src={trash} alt="" /></button>
      </div>
    </div>
  );
}
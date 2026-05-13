import type { Food } from "../../App";

import pencil from "../../assets/pencil.png";
import trash from "../../assets/trash.png";
import type React from "react";

interface FoodCardProps {
  food: Food;
  setEditFood: React.Dispatch<React.SetStateAction<Food | null>>;
  setIsEditFoodModalOpen: React.Dispatch<React.SetStateAction<true | false>>;
  deleteFood: (id: string) => Promise<void>;
}

export function FoodCard({
  food,
  setEditFood,
  setIsEditFoodModalOpen,
  deleteFood,
}: FoodCardProps) {
  function handleEdit() {
    setEditFood(food);
    setIsEditFoodModalOpen(true);
  }

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteFood(food._id);
    }
  }

  return (
    <div className="food-card">
      <h3>{food.name}</h3>
      <p>{food.caloriesPerGram} kcal/g</p>
      <p>{food.category}</p>
      <div className="card-actions">
        <button className="icon-btn" onClick={handleEdit}>
          <img className="icon" src={pencil} alt="" />
        </button>
        <button className="icon-btn" onClick={handleDelete}>
          <img className="icon" src={trash} alt="" />
        </button>
      </div>
    </div>
  );
}

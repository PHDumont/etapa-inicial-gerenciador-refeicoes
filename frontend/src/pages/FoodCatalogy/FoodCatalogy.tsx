import { useState } from "react";
import "./FoodCatalogy.css"
import FoodModal, { type NewFoodData } from "./FoodModal";
import { FoodCard } from "./FoodCard";
import axios from "axios";

export interface Food {
  _id: string;
  name: string;
  caloriesPerGram: number;
  category: string;
}

interface FoodCatalogyProps {
  foods: Food[];
  loadFoods: () => Promise<void>;
}

export function FoodCatalogy({ foods, loadFoods }: FoodCatalogyProps) {

  const [isFoodModalOpen, setIsFoodModalOpen ] = useState(false)

  const handleSaveNewFood = async (newFood: NewFoodData) => {
    await axios.post('/foods', newFood)

    setIsFoodModalOpen(false)

    await loadFoods()
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <h2>Catálogo Completo</h2>
        <button className="add-btn"
        onClick={() => setIsFoodModalOpen(true)}>
          + Novo Alimento
        </button>
      </div>

      <div className="food-grid">
        {foods.map((food) => (
          <FoodCard key={food._id} food={food}/>
        ))}
      </div>
      <FoodModal 
      isOpen = {isFoodModalOpen}
      onClose={() => {setIsFoodModalOpen(false)}}
      onSave={handleSaveNewFood}
      />
    </main>
  );
}

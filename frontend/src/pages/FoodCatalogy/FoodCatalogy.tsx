import { useState } from "react";
import "./FoodCatalogy.css";
import FoodModal, { type NewFoodData } from "./FoodModal";
import { FoodCard } from "./FoodCard";
import axios from "axios";
import { Sidebar } from "../../components/SideBar";
import { SummaryPanel } from "../SummaryPanel";
import EditFoodModal from "./EditFoodModal";
import { type Food } from "../../App";

interface FoodCatalogyProps {
  foods: Food[];
  loadFoods: () => Promise<void>;
}

export function FoodCatalogy({ foods, loadFoods }: FoodCatalogyProps) {
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);
  const [editFood, setEditFood] = useState<Food | null>(null);

  const handleSaveNewFood = async (newFood: NewFoodData) => {
    await axios.post("/foods", { ...newFood, source: "user" });
    setIsFoodModalOpen(false);
    await loadFoods();
  };

  const handleSaveEditFood = async (food: Food) => {
    await axios.put(`/foods/${food._id}`, food);
    setIsEditFoodModalOpen(false);
    await loadFoods();
  };

  const deleteFood = async (id: string) => {
    await axios.delete(`/foods/${id}`);
    await loadFoods();
  };

  return (
    <>
      <title>Catalog</title>
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h2>Complete Catalog</h2>
          <button className="add-btn" onClick={() => setIsFoodModalOpen(true)}>
            + New Food
          </button>
        </div>

        <div className="food-grid">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              setEditFood={setEditFood}
              setIsEditFoodModalOpen={setIsEditFoodModalOpen}
              deleteFood={deleteFood}
            />
          ))}
        </div>
        <FoodModal
          isOpen={isFoodModalOpen}
          onClose={() => {
            setIsFoodModalOpen(false);
          }}
          onSave={handleSaveNewFood}
        />
        <EditFoodModal
          isOpen={isEditFoodModalOpen}
          onClose={() => {
            setIsEditFoodModalOpen(false);
          }}
          onSave={handleSaveEditFood}
          food={editFood}
        />
      </main>
      <SummaryPanel />
    </>
  );
}

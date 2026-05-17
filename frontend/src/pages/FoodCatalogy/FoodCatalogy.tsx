import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        await loadFoods();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, [loadFoods]);

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

  const userFoods = foods.filter((food) => food.source === "user");
  const catalogFoods = foods.filter((food) => food.source === "default");

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

        {isLoading ? (
          <p className="catalog-status">Loading catalog...</p>
        ) : (
          <>
            {userFoods.length > 0 && (
              <section className="catalog-section">
                <h3 className="catalog-section-title">My foods</h3>
                <div className="food-grid">
                  {userFoods.map((food) => (
                    <FoodCard
                      key={food._id}
                      food={food}
                      setEditFood={setEditFood}
                      setIsEditFoodModalOpen={setIsEditFoodModalOpen}
                      deleteFood={deleteFood}
                    />
                  ))}
                </div>
              </section>
            )}

            <section className="catalog-section">
              <h3 className="catalog-section-title">
                Default catalog ({catalogFoods.length})
              </h3>
              {catalogFoods.length === 0 ? (
                <p className="catalog-status">
                  No default foods found. Run the database seed in the backend.
                </p>
              ) : (
                <div className="food-grid">
                  {catalogFoods.map((food) => (
                    <FoodCard
                      key={food._id}
                      food={food}
                      setEditFood={setEditFood}
                      setIsEditFoodModalOpen={setIsEditFoodModalOpen}
                      deleteFood={deleteFood}
                      readOnly
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

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

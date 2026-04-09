import "./Diary.css";
import { SummaryPanel } from "../../SummaryPanel";
import { Sidebar } from "../../components/SideBar";
import { MealCard } from "./MealCard";
import { type Meal } from "../../App";
import { useState } from "react";
import { EditFoodModal } from "./EditFoodModel";
import axios from "axios";

// Tipagens
interface DiaryProps {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  loadMeals: () => Promise<void>;
}

export interface setMainsProp {
  mealId: string;
  foodId: string | null;
  foodName: string | null;
  quantityGrams: number | null;
}
export interface Body {
  quantityGrams: number;
}

export function Diary({ meals, setMeals, loadMeals }: DiaryProps) {
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);
  const [editFoodData, setEditFoodData] = useState<[string, number] | []>([]);
  const [mainMealId, setMainMealId] = useState("");
  const [mainMealFoodId, setMainMealFoodId] = useState("");

  const toggleMeal = (mealId: string) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal._id === mealId ? { ...meal, isExpanded: !meal.isExpanded } : meal,
      ),
    );
  };

  const handleSaveEditFood = async (quantity: Body) => {
    await axios.put(`/meals/${mainMealId}/item/${mainMealFoodId}`, quantity);
    setIsEditFoodModalOpen(false);
    await loadMeals();
  };

  const setMains = ({
    mealId,
    foodId,
    foodName,
    quantityGrams,
  }: setMainsProp) => {
    setMainMealId(mealId);
    if (foodId) {
      setMainMealFoodId(foodId);
      if (foodName && quantityGrams) {
        setEditFoodData([foodName, quantityGrams]);
        setIsEditFoodModalOpen(true);
      }
    }
  };

  const removeFood = async (id: string, itemId: string) => {
    const response = await axios.get<Meal>(`/meals/${id}`)

    const meal = response.data

    const newItems = meal.items.filter(item => item._id !== itemId)

    await axios.put(`/meals/${meal._id}`, { items: newItems})

    await loadMeals()
  };

  const deleteMeal = async (id: string) => {
    await axios.delete(`/meals/${id}`)
    await loadMeals()
  }



  return (
    <>
      <title>Diary</title>
      <Sidebar />
      <main className="diary-container">
        <header className="diary-header">
          <h2>Quarta, 01 de Janeiro</h2>
          <div className="date-nav">
            <button className="icon-btn">{"<"}</button>
            <button className="icon-btn">{">"}</button>
          </div>
        </header>

        <div className="diary-actions">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Buscar Refeicao..." />
          </div>
          <button className="btn-add-meal">Adicionar Refeicao</button>
        </div>

        <div className="meals-list">
          {meals.map((meal) => (
            <MealCard
              key={meal._id}
              meal={meal}
              toggleMeal={toggleMeal}
              setMains={setMains}
              removeFood={removeFood}
              deleteMeal={deleteMeal}
            />
          ))}
        </div>
        <EditFoodModal
          isOpen={isEditFoodModalOpen}
          onClose={() => {
            setIsEditFoodModalOpen(false);
          }}
          onSave={handleSaveEditFood}
          editFoodData={editFoodData}
        />
      </main>
      <SummaryPanel />
    </>
  );
}

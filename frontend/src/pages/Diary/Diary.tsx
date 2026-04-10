import "./Diary.css";
import { SummaryPanel } from "../../SummaryPanel";
import { Sidebar } from "../../components/SideBar";
import { MealCard } from "./MealCard";
import { type Food, type Meal } from "../../App";
import { useEffect, useState } from "react";
import { EditFoodModal } from "./EditFoodModal";
import axios from "axios";
import MealModal from "./MealModal";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

interface DiaryProps {
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  loadMeals: () => Promise<void>;
  foods: Food[];
}

export interface setMainsProp {
  meal: Meal;
  foodId: string | null;
  foodName: string | null;
  quantityGrams: number | null;
}

export interface Body {
  quantityGrams: number;
}

export interface MealData {
  _id: string | null;
  name: string;
  date: string;
  items: item[];
}

interface item {
  foodId: string;
  quantityGrams: number;
}

export function Diary({ setMeals, loadMeals, foods }: DiaryProps) {
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editFoodData, setEditFoodData] = useState<[string, number] | []>([]);
  const [mainMeal, setMainMeal] = useState<Meal | null>(null);
  const [mainMealFoodId, setMainMealFoodId] = useState("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  const [dayMeals, setDayMeals] = useState<Meal[]>([]);
  const [daySelected, setDaySelected] = useState(dayjs());

  useEffect(() => {
    selectDayMeals();
  }, [daySelected]);

  const selectDayMeals = async () => {
    const formattedDate = daySelected.format("YYYY-MM-DD");
    const response = await axios.get<Meal[]>("/meals", {
      params: { date: formattedDate },
    });
    setDayMeals(response.data);
  };

  const toggleMeal = (mealId: string) => {
    setDayMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal._id === mealId ? { ...meal, isExpanded: !meal.isExpanded } : meal
      )
    );
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal._id === mealId ? { ...meal, isExpanded: !meal.isExpanded } : meal
      )
    );
  };

  const handleSaveEditFood = async (quantity: Body) => {
    await axios.put(`/meals/${mainMeal?._id}/item/${mainMealFoodId}`, quantity);
    setIsEditFoodModalOpen(false);
    await loadMeals()
    await selectDayMeals();
  };

  const handleSaveNewMeal = async (meal: MealData, saveEdit: boolean) => {
    if (saveEdit) {
      await axios.put(`/meals/${meal._id}`, meal);
    } else {
      await axios.post("/meals", meal);
    }

    setIsMealModalOpen(false);
    setMainMeal(null);
    await loadMeals();
    await selectDayMeals(); 
  };

  const removeFood = async (id: string, itemId: string) => {
    const response = await axios.get<Meal>(`/meals/${id}`);
    const meal = response.data;
    const newItems = meal.items.filter((item) => item._id !== itemId);
    
    await axios.put(`/meals/${meal._id}`, { items: newItems });
    await loadMeals();
    await selectDayMeals(); 
  };

  const deleteMeal = async (id: string) => {
    await axios.delete(`/meals/${id}`);
    await loadMeals();
    await selectDayMeals();
  };

  const setMains = ({ meal, foodId, foodName, quantityGrams }: setMainsProp) => {
    setMainMeal(meal);
    if (foodId) {
      setMainMealFoodId(foodId);
      if (foodName && quantityGrams) {
        setEditFoodData([foodName, quantityGrams]);
        setIsEditFoodModalOpen(true);
      }
    }
  };

  const openMealModal = (type: boolean, meal: Meal | null) => {
    setIsMealModalOpen(true);
    setMainMeal(meal ? meal : null);
    setIsEdit(type);
  };

  if (!dayMeals) {
    return <div>Carregando refeições...</div>; 
  }

  const dateFormat = dayjs(daySelected).format("dddd, DD [de] MMMM");
  const dateCapitalized = dateFormat.charAt(0).toUpperCase() + dateFormat.slice(1);

  return (
    <>
      <title>Diary</title>
      <Sidebar />
      <main className="diary-container">
        <header className="diary-header">
          <h2>{dateCapitalized}</h2>
          <div className="date-nav">
            <button
              className="icon-btn"
              onClick={() => {
                setDaySelected(dayjs(daySelected).subtract(1, "day"));
              }}
            >
              {"<"}
            </button>
            <button
              className="icon-btn"
              onClick={() => {
                setDaySelected(dayjs(daySelected).add(1, "day"));
              }}
            >
              {">"}
            </button>
          </div>
        </header>

        <div className="diary-actions">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Buscar Refeição..." />
          </div>
          <button className="btn-add-meal" onClick={() => openMealModal(false, null)}>
            Adicionar Refeição
          </button>
        </div>

        <div className="meals-list">
          {dayMeals.map((meal) => (
            <MealCard
              key={meal._id}
              meal={meal}
              toggleMeal={toggleMeal}
              setMains={setMains}
              removeFood={removeFood}
              deleteMeal={deleteMeal}
              openMealModal={openMealModal}
            />
          ))}
        </div>
        
        <EditFoodModal
          isOpen={isEditFoodModalOpen}
          onClose={() => setIsEditFoodModalOpen(false)}
          onSave={handleSaveEditFood}
          editFoodData={editFoodData}
        />
        
        <MealModal
          isOpen={isMealModalOpen}
          onClose={() => setIsMealModalOpen(false)}
          onSave={handleSaveNewMeal}
          foods={foods}
          isEdit={isEdit}
          meal={mainMeal}
        />
      </main>
      <SummaryPanel/>
    </>
  );
}
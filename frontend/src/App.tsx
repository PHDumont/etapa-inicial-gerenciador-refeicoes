import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import axios from "axios";
import { FoodCatalogy } from "./pages/FoodCatalogy/FoodCatalogy";
import { Diary } from "./pages/Diary/Diary";
import "./App.css";

axios.defaults.baseURL = "http://localhost:3000";

export interface Food {
  _id: string;
  name: string;
  caloriesPerGram: number;
  category: string;
}
export interface Meal {
  _id: string;
  name: string;
  date: Date;
  totalCalories: number;
  isExpanded: boolean;
  items: foodId[];
}
export interface foodId {
  foodId: Food;
  quantityGrams: number;
  _id: string;
}

function App() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);

  const loadFoods = async () => {
    const response = await axios.get<Food[]>("/foods");
    setFoods(response.data);
  };

  const loadMeals = async () => {
    const response = await axios.get<Meal[]>("/meals");
    setMeals(response.data);
  };

  useEffect(() => {
    loadFoods();
    loadMeals();
  }, []);

  return (
    <Routes>
      <Route
        path="food-catalogy"
        element={
          <div className="container">
            <FoodCatalogy foods={foods} loadFoods={loadFoods}></FoodCatalogy>
          </div>
        }
      />
      <Route
        path="diary"
        element={
          <div className="container">
            <Diary meals={meals} loadMeals={loadMeals} setMeals={setMeals} foods={foods} />
          </div>
        }
      />
    </Routes>
  );
}

export default App;

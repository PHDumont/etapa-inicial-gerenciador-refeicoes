import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import axios from "axios";
import "./App.css";

const FoodCatalogy = lazy(() =>
  import("./pages/FoodCatalogy/FoodCatalogy").then((m) => ({
    default: m.FoodCatalogy,
  })),
);
const Diary = lazy(() =>
  import("./pages/Diary/Diary").then((m) => ({ default: m.Diary })),
);

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
  date: string;
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

  const loadFoods = async () => {
    const response = await axios.get<Food[]>("/foods");
    setFoods(response.data);
  };

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/diary" replace />} />
      <Route
        path="food-catalogy"
        element={
          <div className="container">
            <Suspense fallback={<div className="route-loading">Carregando…</div>}>
              <FoodCatalogy foods={foods} loadFoods={loadFoods}></FoodCatalogy>
            </Suspense>
          </div>
        }
      />
      <Route
        index={true}
        path="diary"
        element={
          <div className="container">
            <Suspense fallback={<div className="route-loading">Carregando…</div>}>
              <Diary foods={foods} />
            </Suspense>
          </div>
        }
      />
    </Routes>
  );
}

export default App;

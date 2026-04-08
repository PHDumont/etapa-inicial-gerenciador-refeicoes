import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import axios from "axios";
import { FoodCatalogy } from "./pages/FoodCatalogy/FoodCatalogy";
import "./App.css";

axios.defaults.baseURL = "http://localhost:3000";

interface Food {
  _id: string;
  name: string;
  caloriesPerGram: number;
  category: string;
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
      <Route
        path="food-catalogy"
        element={
          <div className="container">
            <FoodCatalogy foods={foods} loadFoods={loadFoods}></FoodCatalogy>
          </div>
        }
      />
    </Routes>
  );
}

export default App;

import { useEffect, useState } from 'react'
// import {Routes, Route} from "react-router"
import axios from 'axios';
import {FoodCatalogy} from "./pages/FoodCatalogy/FoodCatalogy"
import './App.css'

axios.defaults.baseURL = 'http://localhost:3000';

interface Food {
  _id: string;
  name: string;
  caloriesPerGram: number;
  category: string;
}

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Meal Tracker</div>
      <ul className="nav-menu">
        <li className="nav-item">Diário</li>
        <li className="nav-item active">Catálogo de Alimentos</li>
      </ul>
    </aside>
  );
};

const SummaryPanel: React.FC = () => {
  return (
    <aside className="summary-panel">
      {/* Cabeçalho Verde Escuro */}
      <div className="summary-header">
        <h2>Resumo Diário</h2>
        <p className="summary-date">Quarta, 01 de Janeiro</p>
      </div>

      {/* Cartão Cinza com Borda Azul */}
      <div className="summary-card">

        <div className="card-bottom-section">
          <h4>Refeicoes do Dia</h4>
          
          <ul className="meal-list">
            <li className="meal-item">
              <span className="meal-name">Café da Manha</span>
              <span className="meal-calories">350 kcal</span>
            </li>
            <li className="meal-item">
              <span className="meal-name">Almoco</span>
              <span className="meal-calories">650 kcal</span>
            </li>
            <li className="meal-item">
              <span className="meal-name">Lanche</span>
              <span className="meal-calories">150 kcal</span>
            </li>
          </ul>
        </div>
        
      </div>
    </aside>
  );
};

function App(){
  const [foods, setFoods] = useState<Food[]>([]);

  const loadFoods = async () => {
    const response = await axios.get<Food[]>("/foods")
    setFoods(response.data)
  }

  useEffect(() =>{
    loadFoods()
  }, [])

  return (
    <div className="app-container">
      <Sidebar />
      <FoodCatalogy foods={foods} loadFoods={loadFoods}></FoodCatalogy>
      <SummaryPanel />
    </div>
  );
};

export default App;
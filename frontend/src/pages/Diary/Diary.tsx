// import { Sidebar } from "../../components/SideBar"
// import { SummaryPanel } from "../../SummaryPanel"
// import type { Meal } from "../../App"
// import React from "react"


// interface DiaryProps {
//   meals: Meal[];
//   setMeals: React.Dispatch<React.SetStateAction<Meal[]>>
//   loadMeals: () => Promise<void>
// }

// export function Diary({meals, setMeals, loadMeals}: DiaryProps ){

//   const toggleMeal = (mealId: string) => {
//     setMeals((prevMeals) =>
//       prevMeals.map((meal) =>
//         meal.id === mealId ? { ...meal, isExpanded: !meal.isExpanded } : meal
//       )
//     );
//   };

//   return (
//     <>
//     <title>Diário</title>
//     <Sidebar />
//     <SummaryPanel />
//     </>
//   )
// }

import "./Diary.css";
import { SummaryPanel } from "../../SummaryPanel";
import { Sidebar } from "../../components/SideBar";
import type { Meal } from "../../App"

// Tipagens
interface DiaryProps {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>
  loadMeals: () => Promise<void>
}

export function Diary({meals, setMeals, loadMeals}: DiaryProps ){

  // Função para expandir/recolher a refeição
  const toggleMeal = (mealId: string) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal._id === mealId ? { ...meal, isExpanded: !meal.isExpanded } : meal,
      ),
    );
  };

  return (
    <>
    <title>Diary</title>
    <Sidebar />
      <main className="diary-container">
        {/* Cabeçalho */}
        <header className="diary-header">
          <h2>Quarta, 01 de Janeiro</h2>
          <div className="date-nav">
            <button className="icon-btn">{"<"}</button>
            <button className="icon-btn">{">"}</button>
          </div>
        </header>

        {/* Ações (Busca e Adicionar) */}
        <div className="diary-actions">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Buscar Refeicao..." />
          </div>
          <button className="btn-add-meal">Adicionar Refeicao</button>
        </div>

        {/* Lista de Refeições */}
        <div className="meals-list">
          {meals.map((meal) => (
            <div key={meal._id} className="meal-section">
              <div className="meal-header" onClick={() => toggleMeal(meal._id)}>
                <div className="meal-title-group">
                  <span className="toggle-icon">
                    {meal.isExpanded ? "v" : ">"}
                  </span>
                  <h3>
                    {meal.name} ({meal.totalCalories} kcal)
                  </h3>
                </div>
                <div
                  className="meal-header-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="btn-add-item">+</button>
                  <button className="btn-delete-icon">🗑️</button>
                </div>
              </div>

              {meal.isExpanded && meal.items.length > 0 && (
                <div className="food-items-list">
                  {meal.items.map((item) => (
                    <div key={item.foodId._id} className="food-item-card">
                      <div className="food-info-group">
                        <div className="food-details">
                          <span className="food-name">{item.foodId.name}</span>
                          <span className="food-macros">
                            ({item.quantityGrams} g, {(item.quantityGrams * item.foodId.caloriesPerGram).toFixed(1)} kcal)
                          </span>
                        </div>
                      </div>
                      <div className="food-actions">
                        <button className="btn-edit-icon">✏️</button>
                        <button className="btn-delete-icon">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <SummaryPanel />
    </>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import "./SummaryPanel.css";
import { type Meal } from "./App"; 

dayjs.locale("pt-br");

export function SummaryPanel() {
  const today = dayjs(); 
  const [summaryMeals, setSummaryMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const fetchTodayMeals = async () => {
      try {
        const formattedDate = today.format("YYYY-MM-DD");
        
        const response = await axios.get<Meal[]>("/meals", {
          params: { date: formattedDate },
        });
        
        setSummaryMeals(response.data);
      } catch (error) {
        console.error("Error searching for meals in the summary.:", error);
      }
    };

    fetchTodayMeals();
  }, [summaryMeals]);

  const dateFormat = today.format("dddd, DD [de] MMMM");
  const dateCapitalized = dateFormat.charAt(0).toUpperCase() + dateFormat.slice(1);

  return (
    <aside className="summary-panel">
      <div className="summary-header">
        <h2>Resumo de Hoje</h2>
        <p className="summary-date">{dateCapitalized}</p>
      </div>

      <div className="summary-card">
        <div className="card-bottom-section">
          <h4>Refeições do Dia</h4>
          
          {summaryMeals.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
              Nenhuma refeição registrada hoje.
            </p>
          ) : (
            <ul className="meal-list">
              {summaryMeals.map((meal) => (
                <li key={meal._id} className="meal-item">
                  <span className="meal-name">{meal.name}</span>
                  <span className="meal-calories">
                    {meal.totalCalories ? Math.round(meal.totalCalories) : 0} kcal
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
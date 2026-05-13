import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "./SummaryPanel.css";
import { type Meal } from "../App";

dayjs.locale("en");

type SummaryPanelProps = {
  mealSummaryRefreshToken?: number;
};

export function SummaryPanel({ mealSummaryRefreshToken }: SummaryPanelProps) {
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
        console.error("Error searching for meals in the summary:", error);
      }
    };

    fetchTodayMeals();
  }, [mealSummaryRefreshToken]);

  const dateFormat = today.format("dddd, MMMM DD");
  const dateCapitalized =
    dateFormat.charAt(0).toUpperCase() + dateFormat.slice(1);

  return (
    <aside className="summary-panel">
      <div className="summary-header">
        <h2>Today's Summary</h2>
        <p className="summary-date">{dateCapitalized}</p>
      </div>

      <div className="summary-card">
        <div className="card-bottom-section">
          <h4>Meals of the Day</h4>

          {summaryMeals.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
              No meals registered today.
            </p>
          ) : (
            <ul className="meal-list">
              {summaryMeals.map((meal) => (
                <li key={meal._id} className="meal-item">
                  <span className="meal-name">{meal.name}</span>
                  <span className="meal-calories">
                    {meal.totalCalories ? Math.round(meal.totalCalories) : 0}{" "}
                    kcal
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

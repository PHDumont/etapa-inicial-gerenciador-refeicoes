import { type Meal } from "../../App";
import { FoodCard } from "./FoodCard";
import { type setMainsProp } from "./Diary";
import trash from "../../assets/trash.png"

interface MealCardProps {
  meal: Meal
  toggleMeal: (_id: string) => void
  setMains: ({meal, foodId, foodName, quantityGrams}: setMainsProp) => void
  removeFood: (id: string, itemId: string) => Promise<void>
  deleteMeal: (id: string) => Promise<void>
  openMealModal: (type: boolean, meal:Meal) => void
}


export function MealCard({meal, toggleMeal, setMains, removeFood, deleteMeal, openMealModal}: MealCardProps) {

  function handleDelete(){
    if(window.confirm('Tem certeza que deseja excluir?')){
      deleteMeal(meal._id)
    }
  }

  return (
    <div key={meal._id} className="meal-section">
      <div className="meal-header" onClick={() => toggleMeal(meal._id)}>
        <div className="meal-title-group">
          <span className="toggle-icon">{meal.isExpanded ? "v" : ">"}</span>
          <h3>
            {meal.name} ({meal.totalCalories} kcal)
          </h3>
        </div>
        <div
          className="meal-header-actions"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="btn-add-item" onClick={() => openMealModal(true, meal)}>+</button>
          <button className="icon-btn" onClick={handleDelete}> <img className="icon" src={trash}/> </button>
        </div>
      </div>

      {meal.isExpanded && meal.items.length > 0 && (
        <div className="food-items-list">
          {meal.items.map((item) => (
            <FoodCard key={item.foodId._id} item={item} meal={meal} setMains={setMains} removeFood={removeFood}  />
          ))}
        </div>
      )}
    </div>
  );
}

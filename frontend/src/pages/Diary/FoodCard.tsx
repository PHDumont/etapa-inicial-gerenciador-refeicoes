import { memo } from "react";
import type { foodId, Meal } from "../../App";
import type { setMainsProp } from "./Diary";
import { formatLineItemKcal } from "../../utils/nutrition";
import pencil from "../../assets/pencil.png";
import trash from "../../assets/trash.png";

interface FoodCartProps {
  item: foodId;
  meal: Meal;
  setMains: (p: setMainsProp) => void;
  removeFood: (id: string, itemId: string) => Promise<void>;
}

export const FoodCard = memo(function FoodCard({
  item,
  meal,
  setMains,
  removeFood,
}: FoodCartProps) {
  function handleEdit() {
    setMains({
      meal,
      itemId: item._id,
      foodId: item.foodId._id,
      foodName: item.foodId.name,
      quantityGrams: item.quantityGrams,
    });
  }

  function handleDelete() {
    if (window.confirm("Are you sure you want to delete?")) {
      setMains({
        meal,
        itemId: item._id,
        foodId: null,
        foodName: null,
        quantityGrams: null,
      });
      removeFood(meal._id, item._id);
    }
  }

  return (
    <div className="food-item-card">
      <div className="food-info-group">
        <div className="food-details">
          <span className="food-name">{item.foodId.name}</span>
          <span className="food-macros">
            ({item.quantityGrams} g,{" "}
            {formatLineItemKcal(item.quantityGrams, item.foodId.kcalPer100g)}{" "}
            kcal)
          </span>
        </div>
      </div>
      <div className="food-actions">
        <button className="icon-btn" onClick={handleEdit}>
          <img className="icon" src={pencil} alt="Editar" />
        </button>
        <button className="icon-btn" onClick={handleDelete}>
          <img className="icon" src={trash} alt="Excluir" />
        </button>
      </div>
    </div>
  );
});

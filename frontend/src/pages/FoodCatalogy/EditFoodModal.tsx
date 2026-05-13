import { useEffect, useState } from "react";
import "../../styles/modal.css";
import { type Food } from "../../App";
import { parseNewFoodForm } from "../../utils/nutrition";

interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Food) => void;
  food: Food | null;
}

function EditFoodModal({ isOpen, onClose, onSave, food }: EditFoodModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [calories, setCalories] = useState<number | "">("");

  useEffect(() => {
    if (food) {
      setName(food.name);
      setCategory(food.category);
      setCalories(food.caloriesPerGram);
    }
  }, [food]);

  if (!isOpen) return null;
  if (!food) return null;

  const handleSave = () => {
    const parsed = parseNewFoodForm(name, category, calories);
    if (parsed.ok === false) {
      if (parsed.reason === "EMPTY_FIELDS") {
        alert("Fill all fields!");
      } else {
        alert("Invalid calories (use a value ≥ 0).");
      }
      return;
    }

    onSave({
      ...parsed.data,
      _id: food._id,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Food</h3>

        <div className="form-group">
          <label>Food Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Proteins">Proteins</option>
            <option value="Carbohydrates">Carbohydrates</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Dairy">Dairy</option>
            <option value="Beverages">Beverages</option>
            <option value="Sweets">Sweets</option>
            <option value="Grains">Grains</option>
          </select>
        </div>

        <div className="form-group">
          <label>Calories per Gram (kcal)</label>
          <input
            type="number"
            step="0.01"
            value={calories}
            onChange={(e) =>
              setCalories(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditFoodModal;

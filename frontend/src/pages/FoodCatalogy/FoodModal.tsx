import { useState } from "react";
import "../../styles/modal.css";
import { parseNewFoodForm } from "../../utils/nutrition";

export interface NewFoodData {
  name: string;
  category: string;
  caloriesPerGram: number;
}

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewFoodData) => void;
}

function FoodModal({ isOpen, onClose, onSave }: FoodModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [calories, setCalories] = useState<number | "">("");

  if (!isOpen) return null;

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

    onSave(parsed.data);

    setName("");
    setCategory("");
    setCalories("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Register New Food</h3>

        <div className="form-group">
          <label>Food Name</label>
          <input
            type="text"
            placeholder="Ex: Apple"
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
            placeholder="Ex: 0.52"
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

export default FoodModal;

import { useEffect, useState } from "react";
import { FoodSearchInput } from "../../components/FoodSearchInput";
import type { Body, EditFoodData } from "./Diary";

interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (arg1: Body) => void;
  editFoodData: EditFoodData | null;
}

export function EditFoodModal({
  isOpen,
  onClose,
  onSave,
  editFoodData,
}: EditFoodModalProps) {
  const [foodId, setFoodId] = useState("");
  const [foodName, setFoodName] = useState("");
  const [quantityGrams, setQuantityGrams] = useState<number | "">("");

  useEffect(() => {
    if (editFoodData) {
      setFoodId(editFoodData.foodId);
      setFoodName(editFoodData.foodName);
      setQuantityGrams(editFoodData.quantityGrams);
    }
  }, [editFoodData]);

  if (!isOpen) return null;
  if (!editFoodData) return null;

  const handleSave = () => {
    if (!foodId || !foodName.trim()) {
      alert("Select a food!");
      return;
    }

    if (quantityGrams === "" || Number(quantityGrams) < 1) {
      alert("Fill the quantity (minimum 1 g)!");
      return;
    }

    const payload: Body = { quantityGrams: Number(quantityGrams) };

    if (foodId !== editFoodData.foodId) {
      payload.foodId = foodId;
    }

    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit food</h3>

        <div className="form-group">
          <FoodSearchInput
            foodId={foodId}
            foodName={foodName}
            label="Food"
            onSelect={(id, name) => {
              setFoodId(id);
              setFoodName(name);
            }}
          />
        </div>

        <div className="form-group">
          <label>Quantity (g)</label>
          <input
            type="number"
            min={1}
            step={1}
            value={quantityGrams}
            onChange={(e) =>
              setQuantityGrams(
                e.target.value === "" ? "" : Number(e.target.value),
              )
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

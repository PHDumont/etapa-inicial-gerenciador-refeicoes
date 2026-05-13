import { useEffect, useState } from "react";
import type { Body } from "./Diary";

interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (arg1: Body) => void;
  editFoodData: [string, number] | [];
}

export function EditFoodModal({
  isOpen,
  onClose,
  onSave,
  editFoodData,
}: EditFoodModalProps) {
  const [newQuantityGrams, setNewQuantityGrams] = useState<number>();

  useEffect(() => {
    if (editFoodData) {
      setNewQuantityGrams(editFoodData[1]);
    }
  }, [editFoodData]);

  if (!isOpen) return null;
  if (!editFoodData) return null;

  const handleSave = () => {
    if (!newQuantityGrams) {
      alert("Fill the quantity!");
      return;
    }
    onSave({ quantityGrams: newQuantityGrams });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit </h3>

        <div className="form-group">
          <label>{editFoodData[0]}</label>
        </div>

        <div className="form-group">
          <label>Quantity (g)</label>
          <input
            type="number"
            step="1"
            value={newQuantityGrams}
            onChange={(e) => setNewQuantityGrams(Number(e.target.value))}
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

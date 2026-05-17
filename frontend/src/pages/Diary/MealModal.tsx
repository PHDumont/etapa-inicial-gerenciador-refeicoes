import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Meal } from "../../App";
import { FoodBlock } from "./FoodBlock";
import type { MealData } from "./Diary";
import { parseMealPayload } from "../../utils/nutrition";
import type { HandleUpdateBlockType } from "./types";

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealData: MealData, isEdit: boolean) => Promise<void>;
  isEdit: boolean;
  meal: Meal | null;
}

function MealModal({ isOpen, onClose, onSave, isEdit, meal }: MealModalProps) {
  const [name, setName] = useState("");
  const [dateSelect, setDateSelect] = useState("");

  const [foodBlocks, setFoodBlocks] = useState([
    { id: Date.now(), foodId: "", foodName: "", quantityGrams: "" },
  ]);

  useEffect(() => {
    if (!isOpen) return;

    if (meal && isEdit) {
      const loadedBlocks = meal.items.map((item) => ({
        id: Math.random(),
        foodId: item.foodId._id,
        foodName: item.foodId.name,
        quantityGrams: item.quantityGrams.toString(),
      }));

      setFoodBlocks(loadedBlocks);
      setName(meal.name);
      setDateSelect(meal.date.split("T")[0]);
    } else {
      setName("");
      setDateSelect(dayjs().format("YYYY-MM-DD"));
      setFoodBlocks([
        { id: Date.now(), foodId: "", foodName: "", quantityGrams: "" },
      ]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddBlock = () => {
    setFoodBlocks([
      ...foodBlocks,
      { id: Date.now(), foodId: "", foodName: "", quantityGrams: "" },
    ]);
  };

  const handleRemoveBlock = (id: number) => {
    setFoodBlocks(foodBlocks.filter((block) => block.id !== id));
  };

  const handleUpdateBlock: HandleUpdateBlockType = (id, field, value) => {
    setFoodBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, [field]: value } : block,
      ),
    );
  };

  const handleFoodSelect = (
    blockId: number,
    selectedFoodId: string,
    selectedFoodName: string,
  ) => {
    setFoodBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? {
              ...block,
              foodId: selectedFoodId,
              foodName: selectedFoodName,
            }
          : block,
      ),
    );
  };

  const handleSave = () => {
    const parsed = parseMealPayload(name, foodBlocks);
    switch (parsed.ok) {
      case true: {
        const id = meal ? meal._id : null;

        const mealDataToSave = {
          _id: id,
          name: name.trim(),
          date: dateSelect,
          items: parsed.items,
        };

        onSave(mealDataToSave, isEdit);
        break;
      }
      case false: {
        if (parsed.reason === "EMPTY_NAME") {
          alert("Fill the meal name!");
        } else if (parsed.reason === "NO_ITEMS") {
          alert("Add at least one filled food!");
        } else {
          alert("Inform quantities (minimum 1 g).");
        }
        break;
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isEdit ? "Edit" : "Create"} Meal</h3>

        <div className="form-group">
          <label>Meal Name</label>
          <input
            type="text"
            placeholder="Ex: Lunch"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={dateSelect}
            onChange={(e) => setDateSelect(e.target.value)}
          />
        </div>

        <div className="modal-actions modal-actions-add">
          <button className="btn-save" onClick={handleAddBlock}>
            Add
          </button>
        </div>

        <div className="food-blocks">
          {foodBlocks.map((block, index) => (
            <FoodBlock
              key={block.id}
              block={block}
              index={index}
              foodName={block.foodName}
              handleRemoveBlock={handleRemoveBlock}
              handleUpdateBlock={handleUpdateBlock}
              handleFoodSelect={handleFoodSelect}
              length={foodBlocks.length}
            />
          ))}
        </div>

        <div className="modal-actions" style={{ marginTop: "20px" }}>
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Save Meal
          </button>
        </div>
      </div>
    </div>
  );
}

export default MealModal;

import { useEffect, useState } from "react";
import "../../styles/modal.css";
import { type Food } from "../../App";
import { parseFoodForm, type FoodFormInput } from "../../utils/nutrition";

const CATEGORIES = [
  "Proteins",
  "Carbohydrates",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Beverages",
  "Sweets",
  "Grains",
] as const;

const EMPTY_FORM: FoodFormInput = {
  name: "",
  category: "",
  kcalPer100g: "",
  proteinPer100g: "",
  carbohydratesPer100g: "",
  fatPer100g: "",
  fiberPer100g: "",
  sugarPer100g: "",
  sodiumPer100g: "",
};

function foodToFormInput(food: Food): FoodFormInput {
  return {
    name: food.name,
    category: food.category,
    kcalPer100g: food.kcalPer100g,
    proteinPer100g: food.proteinPer100g ?? 0,
    carbohydratesPer100g: food.carbohydratesPer100g ?? 0,
    fatPer100g: food.fatPer100g ?? 0,
    fiberPer100g: food.fiberPer100g ?? 0,
    sugarPer100g: food.sugarPer100g ?? 0,
    sodiumPer100g: food.sodiumPer100g ?? 0,
  };
}

interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Food) => void;
  food: Food | null;
}

function EditFoodModal({ isOpen, onClose, onSave, food }: EditFoodModalProps) {
  const [form, setForm] = useState<FoodFormInput>(EMPTY_FORM);

  useEffect(() => {
    if (food) {
      setForm(foodToFormInput(food));
    }
  }, [food]);

  if (!isOpen) return null;
  if (!food) return null;

  const setField = (field: keyof FoodFormInput, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const setNumericField = (field: keyof FoodFormInput, value: number | "") => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const parsed = parseFoodForm(form);
    if (parsed.ok === false) {
      if (parsed.reason === "EMPTY_FIELDS") {
        alert("Fill all required fields!");
      } else {
        alert("Fill all nutritional fields with values ≥ 0.");
      }
      return;
    }

    onSave({
      ...food,
      ...parsed.data,
      _id: food._id,
    });
  };

  const nutritionFields: { field: keyof FoodFormInput; label: string }[] = [
    { field: "kcalPer100g", label: "Energy (kcal per 100g)" },
    { field: "proteinPer100g", label: "Protein (g per 100g)" },
    { field: "carbohydratesPer100g", label: "Carbohydrates (g per 100g)" },
    { field: "fatPer100g", label: "Fat (g per 100g)" },
    { field: "fiberPer100g", label: "Fiber (g per 100g)" },
    { field: "sugarPer100g", label: "Sugar (g per 100g)" },
    { field: "sodiumPer100g", label: "Sodium (mg per 100g)" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content--wide">
        <h3>Edit Food</h3>

        <div className="form-group">
          <label>Food Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
          >
            <option value="">Select...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {nutritionFields.map(({ field, label }) => (
          <div className="form-group" key={field}>
            <label>{label}</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form[field]}
              onChange={(e) =>
                setNumericField(
                  field,
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
            />
          </div>
        ))}

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

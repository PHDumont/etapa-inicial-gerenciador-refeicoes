import { useState } from "react";
import "../../styles/modal.css";

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

export interface NewFoodData {
  name: string;
  category: string;
  kcalPer100g: number;
  proteinPer100g: number;
  carbohydratesPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  sugarPer100g: number;
  sodiumPer100g: number;
  barcode?: string;
}

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewFoodData) => void;
}

type NumericField = Exclude<keyof NewFoodData, "name" | "category" | "barcode">;

const INITIAL_NUMERIC: Record<NumericField, number | ""> = {
  kcalPer100g: "",
  proteinPer100g: "",
  carbohydratesPer100g: "",
  fatPer100g: "",
  fiberPer100g: "",
  sugarPer100g: "",
  sodiumPer100g: "",
};

function parseRequiredNumber(value: number | ""): number | null {
  if (value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function FoodModal({ isOpen, onClose, onSave }: FoodModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [barcode, setBarcode] = useState("");
  const [numericFields, setNumericFields] =
    useState<Record<NumericField, number | "">>(INITIAL_NUMERIC);

  if (!isOpen) return null;

  const setNumericField = (field: NumericField, value: number | "") => {
    setNumericFields((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setName("");
    setCategory("");
    setBarcode("");
    setNumericFields(INITIAL_NUMERIC);
  };

  const handleSave = () => {
    if (!name.trim() || !category.trim()) {
      alert("Fill all required fields!");
      return;
    }

    const parsed: Record<NumericField, number | null> = {
      kcalPer100g: parseRequiredNumber(numericFields.kcalPer100g),
      proteinPer100g: parseRequiredNumber(numericFields.proteinPer100g),
      carbohydratesPer100g: parseRequiredNumber(
        numericFields.carbohydratesPer100g,
      ),
      fatPer100g: parseRequiredNumber(numericFields.fatPer100g),
      fiberPer100g: parseRequiredNumber(numericFields.fiberPer100g),
      sugarPer100g: parseRequiredNumber(numericFields.sugarPer100g),
      sodiumPer100g: parseRequiredNumber(numericFields.sodiumPer100g),
    };

    if (Object.values(parsed).some((value) => value === null)) {
      alert("Fill all nutritional fields with values ≥ 0.");
      return;
    }

    const data: NewFoodData = {
      name: name.trim(),
      category,
      kcalPer100g: parsed.kcalPer100g!,
      proteinPer100g: parsed.proteinPer100g!,
      carbohydratesPer100g: parsed.carbohydratesPer100g!,
      fatPer100g: parsed.fatPer100g!,
      fiberPer100g: parsed.fiberPer100g!,
      sugarPer100g: parsed.sugarPer100g!,
      sodiumPer100g: parsed.sodiumPer100g!,
    };

    const trimmedBarcode = barcode.trim();
    if (trimmedBarcode) {
      data.barcode = trimmedBarcode;
    }

    onSave(data);
    resetForm();
  };

  const nutritionFields: { field: NumericField; label: string }[] = [
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
              value={numericFields[field]}
              onChange={(e) =>
                setNumericField(
                  field,
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
            />
          </div>
        ))}

        <div className="form-group">
          <label>Barcode (optional)</label>
          <input
            type="text"
            placeholder="Ex: 7891000100103"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
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

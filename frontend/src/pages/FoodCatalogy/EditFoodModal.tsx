import { useEffect, useState } from "react";
import "./FoodModal.css";
import { type Food } from "../../App";

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
    if (!name || !category || calories === "") {
      alert("Preencha todos os campos!");
      return;
    }

    onSave({
      name,
      category,
      caloriesPerGram: Number(calories),
      _id: food._id,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar </h3>

        <div className="form-group">
          <label>Nome do Alimento</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="Proteins">Proteínas</option>
            <option value="Carbohydrates">Carboidratos</option>
            <option value="Vegetables">Vegetais</option>
            <option value="Fruits">Frutas</option>
            <option value="Dairy">Laticínios</option>
            <option value="Beverages">Bebidas</option>
            <option value="Sweets">Doces</option>
            <option value="Grains">Grãos</option>
          </select>
        </div>

        <div className="form-group">
          <label>Calorias por Grama (kcal)</label>
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
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditFoodModal;

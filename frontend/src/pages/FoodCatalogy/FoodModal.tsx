import { useState } from 'react';
import "./FoodModal.css";
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
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [calories, setCalories] = useState<number | ''>('');

  if (!isOpen) return null;

  const handleSave = () => {
    const parsed = parseNewFoodForm(name, category, calories);
    if (!parsed.ok) {
      if (parsed.reason === "EMPTY_FIELDS") {
        alert("Preencha todos os campos!");
      } else {
        alert("Calorias inválidas (use um valor ≥ 0).");
      }
      return;
    }

    onSave(parsed.data);

    setName('');
    setCategory('');
    setCalories('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Cadastrar Novo Alimento</h3>

        <div className="form-group">
          <label>Nome do Alimento</label>
          <input 
            type="text" 
            placeholder="Ex: Maçã" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label>Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
            placeholder="Ex: 0.52" 
            value={calories} 
            onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))} 
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default FoodModal;
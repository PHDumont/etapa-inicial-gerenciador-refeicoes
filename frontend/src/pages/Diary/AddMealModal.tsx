import { useState } from "react";
import dayjs from "dayjs";
import type { Food } from "../../App";
import { FoodBlock } from "./FoodBlock";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealData: unknown) => Promise<void>;
  foods: Food[];
}

export type HandleUpdateBlockType = (
  id: number,
  field: string,
  value: string | number,
) => void;

function AddMealModal({ isOpen, onClose, onSave, foods }: AddMealModalProps) {
  const [name, setName] = useState("");
  const dateToday = dayjs().format("YYYY-MM-DD");
  const [dateSelect, setDateSelect] = useState(dateToday);

  const [foodBlocks, setFoodBlocks] = useState([
    { id: Date.now(), foodId: "", quantityGrams: "" },
  ]);

  if (!isOpen) return null;

  const handleAddBlock = () => {
    setFoodBlocks([
      ...foodBlocks,
      { id: Date.now(), foodId: "", quantityGrams: "" },
    ]);
  };

  const handleRemoveBlock = (id: number) => {
    setFoodBlocks(foodBlocks.filter((block) => block.id !== id));
  };

  const handleUpdateBlock: HandleUpdateBlockType = (id, field, value) => {
    setFoodBlocks(
      foodBlocks.map((block) => {
        if (block.id === id) {
          return { ...block, [field]: value };
        }
        return block;
      }),
    );
  };

  const reset = () => {
    setName("");
    setDateSelect(dateToday);
    setFoodBlocks([{ id: Date.now(), foodId: "", quantityGrams: "" }]);
  };

  const handleSave = () => {
    if (!name) {
      alert("Preencha o nome da refeição!");
      return;
    }

    const validItems = foodBlocks.filter(
      (b) => b.foodId !== "" && b.quantityGrams !== "",
    );

    if (validItems.length === 0) {
      alert("Adicione pelo menos um alimento preenchido!");
      return;
    }

    const mealDataToSave = {
      name,
      date: dateSelect,
      items: validItems.map((item) => ({
        foodId: item.foodId,
        quantityGrams: Number(item.quantityGrams),
      })),
    };

    onSave(mealDataToSave);
    reset()
  };

  const handleClose = () => {
    onClose();
    reset()
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Criar Refeição</h3>

        <div className="form-group">
          <label>Nome da Refeição</label>
          <input
            type="text"
            placeholder="Ex: Lanche"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Data</label>
          <input
            type="date"
            value={dateSelect}
            onChange={(e) => setDateSelect(e.target.value)}
          />
        </div>

        <div className="modal-actions modal-actions-add">
          <button className="btn-save" onClick={handleAddBlock}>
            Adicionar
          </button>
        </div>

        <div className="food-blocks">
          {foodBlocks.map((block, index) => (
            <FoodBlock
              key={block.id}
              block={block}
              index={index}
              foods={foods}
              handleRemoveBlock={handleRemoveBlock}
              handleUpdateBlock={handleUpdateBlock}
              length={foodBlocks.length}
            />
          ))}
        </div>

        <div className="modal-actions" style={{ marginTop: "20px" }}>
          <button className="btn-cancel" onClick={handleClose}>
            Cancelar
          </button>
          <button className="btn-save" onClick={handleSave}>
            Salvar Refeição
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddMealModal;

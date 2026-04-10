import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { Food, Meal } from "../../App";
import { FoodBlock } from "./FoodBlock";
import type { MealData } from "./Diary";

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mealData: MealData, isEdit: boolean) => Promise<void>;
  foods: Food[];
  isEdit: boolean;
  meal: Meal | null;
}

export type HandleUpdateBlockType = (
  id: number,
  field: string,
  value: string | number,
) => void;

function MealModal({
  isOpen,
  onClose,
  onSave,
  foods,
  isEdit,
  meal,
}: MealModalProps) {
  const [name, setName] = useState("");
  const [dateSelect, setDateSelect] = useState("");

  const [foodBlocks, setFoodBlocks] = useState([
    { id: Date.now(), foodId: "", quantityGrams: "" },
  ]);

  useEffect(() => {
    if (!isOpen) return;

    if (meal && isEdit) {
      const loadedBlocks = meal.items.map((item) => ({
        id: Math.random(),
        foodId: item.foodId._id,
        quantityGrams: item.quantityGrams.toString(),
      }));

      setFoodBlocks(loadedBlocks);
      setName(meal.name);
      setDateSelect(dayjs(meal.date).format("YYYY-MM-DD"));
    } else {
      setName("");
      setDateSelect(dayjs().format("YYYY-MM-DD"));
      setFoodBlocks([{ id: Date.now(), foodId: "", quantityGrams: "" }]);
    }
  }, [isOpen]);

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

    const id = meal ? meal._id : null

    const mealDataToSave = {
      _id: id,
      name,
      date: dateSelect,
      items: validItems.map((item) => ({
        foodId: item.foodId,
        quantityGrams: Number(item.quantityGrams),
      })),
    };

    onSave(mealDataToSave, isEdit);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isEdit ? "Editar" : "Criar"} Refeição</h3>

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

export default MealModal;

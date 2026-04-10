import type { Food } from "../../App";
import type { HandleUpdateBlockType } from "./MealModal";

interface FoodBlockProps {
  block: Block;
  index: number;
  foods: Food[];
  handleUpdateBlock: HandleUpdateBlockType;
  handleRemoveBlock: (id: number) => void;
  length: number
}

interface Block {
  id: number;
  foodId: string;
  quantityGrams: string;
}

export function FoodBlock({
  block,
  index,
  foods,
  handleUpdateBlock,
  handleRemoveBlock,
  length
}: FoodBlockProps) {
  return (
    <div className="food-block" key={block.id}>
      <div className="form-group">
        <label>Alimento {index + 1}</label>
        <select
          value={block.foodId}
          onChange={(e) =>
            handleUpdateBlock(block.id, "foodId", e.target.value)
          }
        >
          <option value="" disabled>
            Selecione...
          </option>
          {foods.map((food) => (
            <option key={food._id} value={food._id}>
              {food.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Quantidade (g)</label>
        <input
          type="number"
          step="1"
          placeholder="Ex: 100"
          value={block.quantityGrams}
          onChange={(e) =>
            handleUpdateBlock(block.id, "quantityGrams", e.target.value)
          }
        />
      </div>

      {length > 1 && (
        <button
          className="btn-cancel"
          style={{ marginTop: "10px" }}
          onClick={() => handleRemoveBlock(block.id)}
        >
          Remover Alimento
        </button>
      )}
    </div>
  );
}

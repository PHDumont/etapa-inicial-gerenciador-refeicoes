import { FoodSearchInput } from "../../components/FoodSearchInput";
import type {
  FoodBlockState,
  HandleFoodSelectType,
  HandleUpdateBlockType,
} from "./types";

interface FoodBlockProps {
  block: FoodBlockState;
  index: number;
  foodName: string;
  handleUpdateBlock: HandleUpdateBlockType;
  handleFoodSelect: HandleFoodSelectType;
  handleRemoveBlock: (id: number) => void;
  length: number;
}

export function FoodBlock({
  block,
  index,
  foodName,
  handleUpdateBlock,
  handleFoodSelect,
  handleRemoveBlock,
  length,
}: FoodBlockProps) {
  return (
    <div className="food-block" key={block.id}>
      <div className="form-group">
        <FoodSearchInput
          foodId={block.foodId}
          foodName={foodName || block.foodName}
          label={`Food ${index + 1}`}
          onSelect={(selectedFoodId, name) => {
            handleFoodSelect(block.id, selectedFoodId, name);
          }}
        />
      </div>

      <div className="form-group">
        <label>Quantity (g)</label>
        <input
          type="number"
          step="1"
          placeholder="Ex: 100g"
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
          Remove Food
        </button>
      )}
    </div>
  );
}

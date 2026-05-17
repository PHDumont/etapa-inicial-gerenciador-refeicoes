export type HandleUpdateBlockType = (
  id: number,
  field: string,
  value: string | number,
) => void;

export type HandleFoodSelectType = (
  blockId: number,
  foodId: string,
  foodName: string,
) => void;

export interface FoodBlockState {
  id: number;
  foodId: string;
  foodName: string;
  quantityGrams: string;
}

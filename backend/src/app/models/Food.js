import mongoose from "mongoose";

const categories = [
  "Proteins",
  "Carbohydrates",
  "Vegetables",
  "Fruits",
  "Dairy",
  "Beverages",
  "Sweets",
  "Grains",
];

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: { values: categories } },
    kcalPer100g: { type: Number, required: true, min: 0 },
    proteinPer100g: { type: Number, required: true, min: 0 },
    carbohydratesPer100g: { type: Number, required: true, min: 0 },
    fatPer100g: { type: Number, required: true, min: 0 },
    fiberPer100g: { type: Number, required: true, min: 0 },
    sugarPer100g: { type: Number, required: true, min: 0 },
    sodiumPer100g: { type: Number, required: true, min: 0 },
    barcode: { type: String, required: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    source: {
      type: String,
      required: true,
      enum: { values: ["default", "user", "open-food-facts"] },
    },
  },
  { timestamps: true },
);

const Food = mongoose.model("Food", foodSchema);

export default Food;

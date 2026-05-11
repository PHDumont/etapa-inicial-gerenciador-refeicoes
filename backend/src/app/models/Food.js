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

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  caloriesPerGram: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: { values: categories } },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Food = mongoose.model("Food", foodSchema);

export default Food;

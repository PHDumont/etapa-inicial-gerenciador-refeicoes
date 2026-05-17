import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, min: 1 },
  date: { type: Date, default: Date.now },
  totalCalories: { type: Number, default: 0 },
  isExpanded: { type: Boolean, default: false },
  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
      quantityGrams: { type: Number, required: true, min: 1 },
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

mealSchema.index({ date: 1 });
mealSchema.index({ userId: 1, date: 1, name: 1 });

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;

import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
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
});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;

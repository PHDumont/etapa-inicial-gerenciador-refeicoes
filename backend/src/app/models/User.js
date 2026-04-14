import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    email: { type: String, required: true },
    name: { type: String, required: true },

    currentWeight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },

    dailyCaloriesGoal: { type: Number, default: 2000 },
    dailyWaterIntake: { type: Number, default: 2000 },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

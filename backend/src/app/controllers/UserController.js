import User from "../models/User.js";
import { getAuth } from "@clerk/express";

class UserController {
  getProfile = async (req, res) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await User.findOne({ userId: auth.userId }).lean();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        currentWeight: user.currentWeight,
        height: user.height,
        dailyCaloriesGoal: user.dailyCaloriesGoal,
        dailyWaterIntake: user.dailyWaterIntake,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  updateProfile = async (req, res) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const fields = [
      "currentWeight",
      "height",
      "dailyCaloriesGoal",
      "dailyWaterIntake",
    ];
    const updates = {};

    for (const field of fields) {
      if (req.body[field] === undefined) {
        continue;
      }

      const value = Number(req.body[field]);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          error: `Invalid value for ${field}`,
        });
      }

      updates[field] = value;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid profile fields provided" });
    }

    try {
      const user = await User.findOneAndUpdate(
        { userId: auth.userId },
        updates,
        {
          returnDocument: "after",
          runValidators: true,
        },
      ).lean();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        currentWeight: user.currentWeight,
        height: user.height,
        dailyCaloriesGoal: user.dailyCaloriesGoal,
        dailyWaterIntake: user.dailyWaterIntake,
      });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  findOrCreate = async (req, res) => {
    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { email, name } = req.body;

    try {
      let user = await User.findOne({ userId: auth.userId });

      if (user) {
        return res.status(200).json(user);
      }

      user = await User.create({
        userId: auth.userId,
        email,
        name,
      });

      console.log(user);

      return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ error: "Internal server error" });
    }
  };

  getAll = async (req, res) => {
    const users = await User.find();
    return res.json(users);
  };
}

export default new UserController();

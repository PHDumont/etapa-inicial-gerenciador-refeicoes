import Meal from "../models/Meal.js";
import Food from "../models/Food.js";
import BasicController from "./BasicController.js";

class MealController extends BasicController {
  validateMealItemsOwnership = async (items, userObjectId) => {
    if (!Array.isArray(items) || items.length === 0) {
      return true;
    }

    const foodIds = items.map((item) => item.foodId);
    const ownedFoodsCount = await Food.countDocuments({
      _id: { $in: foodIds },
      userId: userObjectId,
    });

    return ownedFoodsCount === foodIds.length;
  };

  calculateTotalCalories(meal) {
    meal.totalCalories = 0;
    for (const item of meal.items) {
      const food = item.foodId;
      if (
        !food ||
        typeof food !== "object" ||
        typeof food.caloriesPerGram !== "number"
      ) {
        continue;
      }
      meal.totalCalories += food.caloriesPerGram * item.quantityGrams;
    }
  }

  index = async (req, res) => {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { name, date } = req.query;

      let filter = { userId: user._id };

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      if (date) {
        const dateSearch = new Date(date);

        const dateStart = new Date(dateSearch);
        dateStart.setUTCHours(0, 0, 0, 0);
        const dateEnd = new Date(dateSearch);
        dateEnd.setUTCHours(23, 59, 59, 999);

        filter.date = {
          $gte: dateStart,
          $lte: dateEnd,
        };
      }

      const meals = await Meal.find(filter)
        .populate({ path: "items.foodId", match: { userId: user._id } })
        .lean();

      for (const meal of meals) {
        this.calculateTotalCalories(meal);
      }

      return res.json(meals);
    } catch (error) {
      return res.status(500).json({ error: "Internal error server" });
    }
  };

  show = async (req, res) => {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { id } = req.params;
      const meal = await Meal.findOne({ _id: id, userId: user._id })
        .populate({ path: "items.foodId", match: { userId: user._id } })
        .lean();

      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      this.calculateTotalCalories(meal);

      return res.json(meal);
    } catch (error) {
      return res.status(500).json({ error: "Internal error server" });
    }
  };

  create = async (req, res) => {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const hasOnlyOwnedFoods = await this.validateMealItemsOwnership(
        req.body.items,
        user._id,
      );

      if (!hasOnlyOwnedFoods) {
        return res.status(404).json({ error: "Food not found" });
      }

      const newMeal = { ...req.body, userId: user._id };

      const meal = await Meal.create(newMeal);
      return res.status(201).json(meal);
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages });
      }
      return res.status(500).json({ error: "Internal error server" });
    }
  };

  update = async (req, res) => {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { id } = req.params;
      const updatePayload = { ...req.body };
      delete updatePayload.userId;

      if (updatePayload.items) {
        const hasOnlyOwnedFoods = await this.validateMealItemsOwnership(
          updatePayload.items,
          user._id,
        );

        if (!hasOnlyOwnedFoods) {
          return res.status(404).json({ error: "Food not found" });
        }
      }

      const meal = await Meal.findOneAndUpdate(
        { _id: id, userId: user._id },
        updatePayload,
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      return res.json(meal);
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages });
      }
      return res.status(500).json({ error: "Error updating" });
    }
  };

  updateFood = async (req, res) => {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { id, itemId } = req.params;

      const meal = await Meal.findOne({ _id: id, userId: user._id });

      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      const editItem = meal.items.find(
        (item) => item._id.toString() === itemId,
      );

      if (!editItem) {
        return res.status(404).json({ error: "Food not found" });
      }

      const { quantityGrams } = req.body;

      editItem.quantityGrams = quantityGrams;

      await meal.save();
      await meal.populate({
        path: "items.foodId",
        match: { userId: user._id },
      });
      this.calculateTotalCalories(meal);

      return res.json(meal);
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages });
      }
      return res.status(500).json({ error: "Error updating" });
    }
  };

  deleteItem = async (req, res) => {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { id, itemId } = req.params;

      const meal = await Meal.findOne({ _id: id, userId: user._id });

      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      const before = meal.items.length;
      meal.items = meal.items.filter((item) => item._id.toString() !== itemId);

      if (meal.items.length === before) {
        return res.status(404).json({ error: "Item not found" });
      }

      await meal.save();
      await meal.populate({
        path: "items.foodId",
        match: { userId: user._id },
      });
      this.calculateTotalCalories(meal);

      return res.json(meal);
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages });
      }
      return res.status(500).json({ error: "Error deleting item" });
    }
  };

  delete = async (req, res) => {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { id } = req.params;

      const meal = await Meal.findOneAndDelete({ _id: id, userId: user._id });

      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }

      return res.json();
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages });
      }
      return res.status(500).json({ error: "Error deleting" });
    }
  };
}

export default new MealController();

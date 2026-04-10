import Meal from "../models/Meal.js";

class MealController {
  calculateTotalCalories = async (meal) => {
    await meal.items.forEach((item) => {
      const food = item.foodId;

      if (!food) {
        return res.status(404).json({ error: "Food not found" });
      }

      let caloriesFood = food.caloriesPerGram * item.quantityGrams;
      meal.totalCalories += caloriesFood;
    });
  };

  index = async (req, res) => {
    const { name, date } = req.query;

    let filter = {};

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

    const meals = await Meal.find(filter).populate("items.foodId");

    meals.forEach((meal) => {
      this.calculateTotalCalories(meal);
    });

    return res.json(meals);
  };

  show = async (req, res) => {
    const { id } = req.params;
    const meal = await Meal.findById(id).populate("items.foodId");

    if (!meal) {
      return res.status(404).json({ error: "Meal not found" });
    }

    let total = 0;

    this.calculateTotalCalories(meal);

    return res.json(meal);
  };

  create = async (req, res) => {
    try {
      const meal = await Meal.create(req.body);
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
      const { id } = req.params;

      const meal = await Meal.findByIdAndUpdate(id, req.body, {
        returnDocument: "after",
        runValidators: true,
      });

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
      const { id, itemId } = req.params;

      const meal = await Meal.findById(id);

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

      this.calculateTotalCalories(meal)

      return res.json(meal);

    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages });
      }
      return res.status(500).json({ error: "Error updating" });
    }
  };

  delete = async (req, res) => {
    try {
      const { id } = req.params;

      const meal = await Meal.findByIdAndDelete(id);

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

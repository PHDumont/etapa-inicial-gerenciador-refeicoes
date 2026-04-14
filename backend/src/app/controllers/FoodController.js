import Food from "../models/Food.js";

class FoodController {
  index = async (req, res) => {
    const { name, caloriesPerGram, category, sort, order } = req.query;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (caloriesPerGram) {
      filter.caloriesPerGram = { $lte: Number(caloriesPerGram) };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    const sortOrder = order || "name";
    const sortDirection = sort === "desc" ? -1 : 1;

    const foods = await Food.find(filter)
      .sort({ [sortOrder]: sortDirection })
      .lean();

    return res.json(foods);
  };

  show = async (req, res) => {
    const food = await Food.findById(req.params.foodId).lean();

    if (!food) {
      return res.status(404).json();
    }

    return res.json(food);
  };

  create = async (req, res) => {
    try {
      const food = await Food.create(req.body);
      return res.status(201).json(food);
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
      const auth = getAuth(req);

      if (!auth.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = auth.userId;

      console.log(userId);

      const { id } = req.params;

      const food = await Food.findByIdAndUpdate(id, req.body, {
        returnDocument: "after",
        runValidators: true,
      });

      if (!food) {
        return res.status(404).json({ error: "Food not found" });
      }

      return res.json(food);
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

      const food = await Food.findByIdAndDelete(id);

      if (!food) {
        return res.status(404).json({ error: "Food not found" });
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

export default new FoodController();

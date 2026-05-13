import Food from "../models/Food.js";
import BasicController from "./BasicController.js";
import openFoodFactsService from "../services/openFoodFactsService.js";

class FoodController extends BasicController {
  index = async (req, res) => {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { name, caloriesPerGram, category, sort, order } = req.query;

      let filter = { userId: user._id };

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

      const food = await Food.findOne({
        _id: req.params.foodId,
        userId: user._id,
      }).lean();

      if (!food) {
        return res.status(404).json();
      }

      return res.json(food);
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

      const foodPayload = { ...req.body, userId: user._id };
      const food = await Food.create(foodPayload);

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
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { id } = req.params;
      const updatePayload = { ...req.body };
      delete updatePayload.userId;

      const food = await Food.findOneAndUpdate(
        { _id: id, userId: user._id },
        updatePayload,
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

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
      const user = await this.getCurrentUser(req, res);

      if (!user) {
        return;
      }

      const { id } = req.params;

      const food = await Food.findOneAndDelete({ _id: id, userId: user._id });

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

  test = async (req, res) => {
    const { name } = req.query;

    const filter = {
      userId: "69dec5eb63be353a382efe25",
    };

    const sortOrder = "name";
    const sortDirection = 1;

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const foods = await Food.find(filter)
      .sort({ [sortOrder]: sortDirection })
      .lean();

    if (foods.length === 0) {
      await this.searchExternal(req, res);
      // return res.json([]);
      return;
    }

    return res.json(foods.map((food) => food.name));
  };

  searchExternal = async (req, res) => {
    try {
      // const user = await this.getCurrentUser(req, res);
      // if (!user) {
      //   return;
      // }
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const foods = await openFoodFactsService.search(query);
      return res.json(foods);
    } catch (error) {
      return res.status(500).json({ error: "Internal error server" });
    }
  };
}

export default new FoodController();

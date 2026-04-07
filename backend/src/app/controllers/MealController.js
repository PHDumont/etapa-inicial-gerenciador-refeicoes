import Meal from "../models/Meal.js";

class MealController {
  index = async (req, res) => {
    const { name, date} = req.query;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (date) {
      const dateSearch = new Date(date)

      const dateStart = new Date(dateSearch)
      dateStart.setUTCDate(0,0,0,0)
      const dateEnd = new Date(dateSearch)
      dateEnd.setUTCDate(23,59,59,999)

      filter.date = {
        $gte: dateStart,
        $lte: dateEnd
      }
    }

    const meals = await Meal.find(filter);

    return res.json(meals);
  };

  show = async (req, res) => {
    const filter = { _id: req.params.mealId };
    const meal = await Meal.find(filter);

    if (!meal) {
      return res.status(404).json();
    }

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

  delete = async (req, res) => {
    try{
      const {id} = req.params

    const meal = await Meal.findByIdAndDelete(id)

    if (!meal){
      return res.status(404).json({ error: "Meal not found" });
    }

    return res.json()
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ errors: messages });
      }
      return res.status(500).json({ error: "Error deleting" });
    }
  }
}

export default new MealController();

import Food from "../models/Food.js";

class FoodController {

  list = async (req, res) => {
    const foods = await Food.find()
    return res.json(foods)
  }



  create

}

export default new FoodController()
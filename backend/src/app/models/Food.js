import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {type: String, required: true},
  caloriesPerGram: {type: Number, required: true},
})

const Food = mongoose.model('User', foodSchema)

export default Food
import mongoose from "mongoose";
import Food from "../app/models/Food.js";
import Meal from "../app/models/Meal.js";

const dbUser = "admin";
const dbPass = "admin";
const dbHost = "localhost";
const dbPort = "27017";
const dbName = "db-mongodb";

const uri = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

async function seed() {
  await mongoose.connect(uri);

  await Food.deleteMany({});
  await Meal.deleteMany({});

  const defaultFoods = [
    {
      name: "Arroz",
      caloriesPerGram: 1.5,
      category: "Carbohydrates",
    },
    {
      name: "Uva",
      caloriesPerGram: 2.5,
      category: "Fruits",
    },
    {
      name: "Ovo",
      caloriesPerGram: 1.2,
      category: "Proteins",
    },
    {
      name: "Vagem",
      caloriesPerGram: 1.6,
      category: "Vegetables",
    },
  ];

  const newFoods = await Food.insertMany(defaultFoods);

  const defaultMeals = [
    {
      name: "Cafe da Manha",
      date: new Date(),
      items: [
        {
          foodId: newFoods[1]._id,
          quantityGrams: 100,
        },
        {
          foodId: newFoods[2]._id,
          quantityGrams: 150,
        },
      ],
    },
    {
      name: "Almoco",
      date: new Date(),
      items: [
        {
          foodId: newFoods[0]._id,
          quantityGrams: 300,
        },
        {
          foodId: newFoods[1]._id,
          quantityGrams: 100,
        },
        {
          foodId: newFoods[3]._id,
          quantityGrams: 30,
        },
      ],
    },
    {
      name: "Lanche",
      date: new Date('2026-01-01T12:00:00Z'),
      items: [
        {
          foodId: newFoods[1]._id,
          quantityGrams: 120,
        },
        {
          foodId: newFoods[3]._id,
          quantityGrams: 80,
        },
      ],
    },
  ];

  const newMeals = await Meal.insertMany(defaultMeals)

  process.exit();
}

seed();

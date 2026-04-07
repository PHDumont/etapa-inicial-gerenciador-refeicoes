import mongoose from "mongoose";
import Food from "../app/models/Food.js";

const dbUser = "admin";
const dbPass = "admin";
const dbHost = "localhost";
const dbPort = "27017";
const dbName = "db-mongodb";

const uri = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

async function seed() {
  await mongoose.connect(uri);

  await Food.deleteMany({});

  const defaultFoods = [
    {
      name: "Arroz",
      caloriesPerGram: 1.5,
      category: "Carbohydrates"
    },
    {
      name: "Uva",
      caloriesPerGram: 2.5,
      category: "Fruits"
    },
    {
      name: "Ovo",
      caloriesPerGram: 1.2,
      category: "Proteins"
    },
    {
      name: "Vagem",
      caloriesPerGram: 1.6,
      category: "Vegetables"
    },
  ];

  await Food.insertMany(defaultFoods)

  process.exit()
};

seed()
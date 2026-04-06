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
    },
    {
      name: "Farofa",
      caloriesPerGram: 2.5,
    },
    {
      name: "Ovo",
      caloriesPerGram: 1.2,
    },
    {
      name: "Batata",
      caloriesPerGram: 1.6,
    },
  ];

  await Food.insertMany(defaultFoods)

  process.exit()
};

seed()
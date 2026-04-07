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
    // ================= PROTEINS =================
    {
      name: "Peito de Frango Grelhado",
      category: "Proteins",
      caloriesPerGram: 1.65,
    },
    {
      name: "Carne Moída (Patinho)",
      category: "Proteins",
      caloriesPerGram: 1.33,
    },
    { name: "Salmão Assado", category: "Proteins", caloriesPerGram: 2.08 },
    { name: "Ovo Cozido", category: "Proteins", caloriesPerGram: 1.55 },
    { name: "Tofu", category: "Proteins", caloriesPerGram: 0.76 },
    { name: "Atum em Água", category: "Proteins", caloriesPerGram: 1.16 },
    { name: "Lombo Suíno", category: "Proteins", caloriesPerGram: 1.43 },

    // ================= CARBOHYDRATES =================
    { name: "Arroz Branco", category: "Carbohydrates", caloriesPerGram: 1.3 },
    { name: "Batata Doce", category: "Carbohydrates", caloriesPerGram: 0.86 },
    {
      name: "Macarrão Cozido",
      category: "Carbohydrates",
      caloriesPerGram: 1.58,
    },
    {
      name: "Mandioca Cozida",
      category: "Carbohydrates",
      caloriesPerGram: 1.6,
    },
    { name: "Pão Francês", category: "Carbohydrates", caloriesPerGram: 2.89 },
    {
      name: "Arroz Integral",
      category: "Carbohydrates",
      caloriesPerGram: 1.11,
    },
    { name: "Tapioca", category: "Carbohydrates", caloriesPerGram: 3.36 },

    // ================= VEGETABLES =================
    { name: "Brócolis", category: "Vegetables", caloriesPerGram: 0.34 },
    { name: "Alface", category: "Vegetables", caloriesPerGram: 0.15 },
    { name: "Tomate", category: "Vegetables", caloriesPerGram: 0.18 },
    { name: "Cenoura", category: "Vegetables", caloriesPerGram: 0.41 },
    { name: "Espinafre", category: "Vegetables", caloriesPerGram: 0.23 },
    { name: "Abobrinha", category: "Vegetables", caloriesPerGram: 0.17 },
    { name: "Couve-flor", category: "Vegetables", caloriesPerGram: 0.25 },

    // ================= FRUITS =================
    { name: "Banana Prata", category: "Fruits", caloriesPerGram: 0.89 },
    { name: "Maçã", category: "Fruits", caloriesPerGram: 0.52 },
    { name: "Laranja", category: "Fruits", caloriesPerGram: 0.47 },
    { name: "Morango", category: "Fruits", caloriesPerGram: 0.32 },
    { name: "Uva", category: "Fruits", caloriesPerGram: 0.69 },
    { name: "Abacaxi", category: "Fruits", caloriesPerGram: 0.5 },
    { name: "Mamão Papaia", category: "Fruits", caloriesPerGram: 0.43 },

    // ================= DAIRY =================
    { name: "Leite Integral", category: "Dairy", caloriesPerGram: 0.6 },
    { name: "Queijo Mussarela", category: "Dairy", caloriesPerGram: 3.0 },
    { name: "Iogurte Natural", category: "Dairy", caloriesPerGram: 0.61 },
    { name: "Manteiga", category: "Dairy", caloriesPerGram: 7.17 },
    { name: "Queijo Cottage", category: "Dairy", caloriesPerGram: 0.98 },
    { name: "Leite Desnatado", category: "Dairy", caloriesPerGram: 0.34 },

    // ================= BEVERAGES =================
    {
      name: "Suco de Laranja (Natural)",
      category: "Beverages",
      caloriesPerGram: 0.45,
    },
    { name: "Café sem Açúcar", category: "Beverages", caloriesPerGram: 0.02 },
    {
      name: "Refrigerante de Cola",
      category: "Beverages",
      caloriesPerGram: 0.42,
    },
    { name: "Chá Verde", category: "Beverages", caloriesPerGram: 0.01 },
    { name: "Cerveja Pilsen", category: "Beverages", caloriesPerGram: 0.43 },
    { name: "Água de Coco", category: "Beverages", caloriesPerGram: 0.19 },

    // ================= SWEETS =================
    { name: "Chocolate ao Leite", category: "Sweets", caloriesPerGram: 5.35 },
    { name: "Sorvete de Baunilha", category: "Sweets", caloriesPerGram: 2.07 },
    { name: "Brigadeiro", category: "Sweets", caloriesPerGram: 3.3 },
    {
      name: "Bolo de Cenoura com Chocolate",
      category: "Sweets",
      caloriesPerGram: 4.15,
    },
    { name: "Biscoito Recheado", category: "Sweets", caloriesPerGram: 4.7 },

    // ================= GRAINS =================
    { name: "Aveia em Flocos", category: "Grains", caloriesPerGram: 3.89 },
    { name: "Feijão Preto Cozido", category: "Grains", caloriesPerGram: 0.77 },
    { name: "Grão de Bico Cozido", category: "Grains", caloriesPerGram: 1.64 },
    { name: "Lentilha Cozida", category: "Grains", caloriesPerGram: 1.16 },
    { name: "Quinoa Cozida", category: "Grains", caloriesPerGram: 1.2 },
  ];

  const newFoods = await Food.insertMany(defaultFoods);

  const getFoodId = (foodName) => {
    const food = newFoods.find((f) => f.name === foodName);
    if (!food) throw new Error(`Not found: ${foodName}`);
    return food._id;
  };

  const dateToday = new Date();
  const dataYesterday = new Date();
  dataYesterday.setDate(dataYesterday.getDate() - 1);

  const defaultMeals = [
    {
      name: "Café da Manhã",
      date: dateToday,
      items: [
        { foodId: getFoodId("Pão Francês"), quantityGrams: 50 },
        { foodId: getFoodId("Queijo Mussarela"), quantityGrams: 30 },
        { foodId: getFoodId("Mamão Papaia"), quantityGrams: 150 },
        { foodId: getFoodId("Café sem Açúcar"), quantityGrams: 200 },
      ],
    },
    {
      name: "Almoço",
      date: dateToday,
      items: [
        { foodId: getFoodId("Arroz Branco"), quantityGrams: 150 },
        { foodId: getFoodId("Feijão Preto Cozido"), quantityGrams: 100 },
        { foodId: getFoodId("Peito de Frango Grelhado"), quantityGrams: 120 },
        { foodId: getFoodId("Alface"), quantityGrams: 50 },
        { foodId: getFoodId("Tomate"), quantityGrams: 50 },
      ],
    },
    {
      name: "Lanche da Tarde",
      date: dateToday,
      items: [
        { foodId: getFoodId("Iogurte Natural"), quantityGrams: 170 },
        { foodId: getFoodId("Aveia em Flocos"), quantityGrams: 30 },
        { foodId: getFoodId("Banana Prata"), quantityGrams: 100 },
      ],
    },
    {
      name: "Jantar",
      date: dateToday,
      items: [
        { foodId: getFoodId("Macarrão Cozido"), quantityGrams: 200 },
        { foodId: getFoodId("Carne Moída (Patinho)"), quantityGrams: 100 },
        { foodId: getFoodId("Brócolis"), quantityGrams: 80 },
      ],
    },

    {
      name: "Café da Manhã",
      date: dataYesterday,
      items: [
        { foodId: getFoodId("Tapioca"), quantityGrams: 100 },
        { foodId: getFoodId("Ovo Cozido"), quantityGrams: 100 }, // 2 ovos
        { foodId: getFoodId("Suco de Laranja (Natural)"), quantityGrams: 200 },
      ],
    },
    {
      name: "Almoço",
      date: dataYesterday,
      items: [
        { foodId: getFoodId("Batata Doce"), quantityGrams: 150 },
        { foodId: getFoodId("Salmão Assado"), quantityGrams: 150 },
        { foodId: getFoodId("Espinafre"), quantityGrams: 80 },
      ],
    },
    {
      name: "Ceia (Madrugada)",
      date: new Date(dataYesterday.setUTCHours(23, 30, 0, 0)),
      items: [
        { foodId: getFoodId("Chocolate ao Leite"), quantityGrams: 25 }, // 1 tablete
        { foodId: getFoodId("Leite Integral"), quantityGrams: 200 },
      ],
    },
  ];

  const newMeals = await Meal.insertMany(defaultMeals);

  process.exit();
}

seed();

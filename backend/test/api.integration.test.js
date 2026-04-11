import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import Food from "../src/app/models/Food.js";
import Meal from "../src/app/models/Meal.js";

let app;
let mongoServer;

beforeAll(async () => {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.NODE_ENV = "test";
  await import("../src/database/index.js");
  const { default: application } = await import("../src/app.js");
  app = application;
}, 120_000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
  await Food.deleteMany({});
  await Meal.deleteMany({});
});

describe("API — alimentos (cadastro, listagem, busca, remoção, validação)", () => {
  it("cadastra alimento válido e lista", async () => {
    const created = await request(app)
      .post("/foods")
      .send({
        name: "Arroz",
        category: "Grains",
        caloriesPerGram: 1.3,
      })
      .expect(201);

    expect(created.body.name).toBe("Arroz");

    const list = await request(app).get("/foods").expect(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].name).toBe("Arroz");
  });

  it("entrada inválida: categoria fora do enum retorna 400", async () => {
    const res = await request(app)
      .post("/foods")
      .send({
        name: "X",
        category: "InvalidCategory",
        caloriesPerGram: 1,
      })
      .expect(400);

    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("entrada inválida: calorias por grama negativas retorna 400", async () => {
    const res = await request(app)
      .post("/foods")
      .send({
        name: "Y",
        category: "Fruits",
        caloriesPerGram: -0.1,
      })
      .expect(400);

    expect(res.body.errors).toBeDefined();
  });

  it("busca por nome (filtro) — case insensitive", async () => {
    await Food.create({
      name: "Banana Prata",
      category: "Fruits",
      caloriesPerGram: 0.89,
    });
    await Food.create({
      name: "Feijão Preto",
      category: "Grains",
      caloriesPerGram: 1.2,
    });

    const res = await request(app).get("/foods").query({ name: "banana" }).expect(200);

    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Banana Prata");
  });

  it("remove alimento existente", async () => {
    const doc = await Food.create({
      name: "Temp",
      category: "Beverages",
      caloriesPerGram: 0.01,
    });

    await request(app).delete(`/foods/${doc._id.toString()}`).expect(200);

    const after = await Food.findById(doc._id);
    expect(after).toBeNull();
  });
});

describe("API — refeições e cálculo de calorias", () => {
  async function createSampleFood() {
    const res = await request(app)
      .post("/foods")
      .send({
        name: "Ovo",
        category: "Proteins",
        caloriesPerGram: 1.43,
      })
      .expect(201);
    return res.body;
  }

  it("cadastra refeição com itens e GET retorna total calórico coerente", async () => {
    const food = await createSampleFood();

    const mealRes = await request(app)
      .post("/meals")
      .send({
        name: "Café",
        date: "2026-04-10",
        items: [{ foodId: food._id, quantityGrams: 50 }],
      })
      .expect(201);

    const show = await request(app).get(`/meals/${mealRes.body._id}`).expect(200);

    expect(show.body.totalCalories).toBeCloseTo(1.43 * 50, 5);
  });

  it("entrada inválida: quantidade zero no item ao criar refeição retorna 400", async () => {
    const food = await createSampleFood();

    const res = await request(app)
      .post("/meals")
      .send({
        name: "Almoço",
        items: [{ foodId: food._id, quantityGrams: 0 }],
      })
      .expect(400);

    expect(res.body.errors).toBeDefined();
  });

  it("caso limite: após remover único item, total calórico volta a zero no GET", async () => {
    const food = await createSampleFood();

    const mealRes = await request(app)
      .post("/meals")
      .send({
        name: "Lanche",
        items: [{ foodId: food._id, quantityGrams: 100 }],
      })
      .expect(201);

    const itemId = mealRes.body.items[0]._id;

    const updated = await request(app)
      .delete(`/meals/${mealRes.body._id}/item/${itemId}`)
      .expect(200);

    expect(updated.body.items).toHaveLength(0);
    expect(updated.body.totalCalories).toBe(0);
  });

  it("listagem por data (UTC): refeição do dia aparece na busca", async () => {
    const food = await createSampleFood();
    const day = "2026-01-15T12:00:00.000Z";

    await request(app)
      .post("/meals")
      .send({
        name: "Jantar",
        date: day,
        items: [{ foodId: food._id, quantityGrams: 10 }],
      })
      .expect(201);

    const list = await request(app).get("/meals").query({ date: "2026-01-15" }).expect(200);

    expect(list.body.length).toBe(1);
    expect(list.body[0].name).toBe("Jantar");
  });

  it("entrada inválida: atualizar item com quantidade inválida retorna 400", async () => {
    const food = await createSampleFood();

    const mealRes = await request(app)
      .post("/meals")
      .send({
        name: "M",
        items: [{ foodId: food._id, quantityGrams: 20 }],
      })
      .expect(201);

    const itemId = mealRes.body.items[0]._id;

    const res = await request(app)
      .put(`/meals/${mealRes.body._id}/item/${itemId}`)
      .send({ quantityGrams: 0 })
      .expect(400);

    expect(res.body.errors).toBeDefined();
  });
});

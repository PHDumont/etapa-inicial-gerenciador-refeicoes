import { Router } from "express";

import foods from "./app/controllers/FoodController.js"

const routes = new Router()


routes.get("/foods", foods.index)
routes.get("/foods/:foodId", foods.show)
routes.post("/foods", foods.create)
routes.put("/foods/:id", foods.update)
routes.delete("/foods/:id", foods.delete)

export default routes
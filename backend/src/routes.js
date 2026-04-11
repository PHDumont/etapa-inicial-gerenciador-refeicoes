import { Router } from "express";

import foods from "./app/controllers/FoodController.js"
import meals from "./app/controllers/MealController.js"

const routes = new Router()


routes.get("/foods", foods.index)
routes.get("/foods/:foodId", foods.show)
routes.post("/foods", foods.create)
routes.put("/foods/:id", foods.update)
routes.delete("/foods/:id", foods.delete)

routes.get("/meals", meals.index)
routes.get("/meals/:id", meals.show)
routes.post("/meals", meals.create)
routes.put("/meals/:id", meals.update)
routes.put("/meals/:id/item/:itemId", meals.updateFood)
routes.delete("/meals/:id/item/:itemId", meals.deleteItem)
routes.delete("/meals/:id", meals.delete)

export default routes
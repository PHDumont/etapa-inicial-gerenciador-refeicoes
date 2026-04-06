import { Router } from "express";

import foods from "./app/controllers/FoodController.js"

const routes = new Router()


routes.get("/foods", foods.list)

export default routes
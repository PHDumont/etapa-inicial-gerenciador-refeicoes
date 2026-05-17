import { Router } from "express";

import foods from "./app/controllers/FoodController.js";
import meals from "./app/controllers/MealController.js";
import users from "./app/controllers/UserController.js";

const routes = new Router();

routes.get("/foods/search/external", foods.searchExternal);

routes.get("/foods", foods.index);
routes.get("/foods/:foodId", foods.show);
routes.post("/foods", foods.create);
routes.put("/foods/:id", foods.update);
routes.delete("/foods/:id", foods.delete);

routes.get("/meals", meals.index);
routes.get("/meals/:id", meals.show);
routes.post("/meals", meals.create);
routes.put("/meals/:id", meals.update);
routes.put("/meals/:id/item/:itemId", meals.updateFood);
routes.delete("/meals/:id/item/:itemId", meals.deleteItem);
routes.delete("/meals/:id", meals.delete);

routes.post("/users/sync", users.findOrCreate);
routes.get("/users/profile", users.getProfile);
routes.put("/users/profile", users.updateProfile);

// Admin routes
routes.get("/users", users.getAll);

export default routes;

import express from "express";
import routes from "./routes.js";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { clerkMiddleware, getAuth } from "@clerk/express";

dotenv.config();

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(compression());
    this.server.use(express.json());
    this.server.use(clerkMiddleware());
    this.server.use(this.checkAuth);
  }

  routes() {
    this.server.use(routes);
  }

  checkAuth(req, res, next) {
    const auth = getAuth(req);
    if (!auth.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return next();
  }
}

export default new App().server;

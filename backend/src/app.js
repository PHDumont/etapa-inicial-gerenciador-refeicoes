import express from "express";
import routes from "./routes.js";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;

import { Router } from "express";
const routes = new Router();

import authController from "../controllers/auth.controller.js";

routes.post("/register", authController.register);

routes.post("/login", authController.login);

export default routes;

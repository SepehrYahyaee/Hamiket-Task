import express from "express";
import { userController } from "../controllers/index.js";

export const router = express.Router(); // api/v1

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);

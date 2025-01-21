import express from "express";
import { userController } from "../controllers/index.js";
import {
    registerDto,
    loginDto,
    validationErrorHandler,
} from "../middlewares/index.js";

export const router = express.Router(); // api/v1

router.route("/register").post(registerDto, userController.register);

router.route("/login").post(loginDto, userController.login);

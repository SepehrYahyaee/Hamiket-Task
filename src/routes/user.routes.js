import express from "express";
import { userController } from "../controllers/index.js";
import { registerDto, loginDto } from "../middlewares/index.js";
import { asyncErrorHandler } from "../utilities/index.js";

export const router = express.Router(); // api/v1

router
    .route("/register")
    .post(registerDto, asyncErrorHandler(userController.register));

router.route("/login").post(loginDto, asyncErrorHandler(userController.login));

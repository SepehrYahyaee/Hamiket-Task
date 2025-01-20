import express from "express";
import { taskController } from "../controllers/index.js";
import { auth } from "../middlewares/index.js";

export const router = express.Router(); // api/v1

router
    .route("/tasks")
    .post(auth, taskController.createTask)
    .get(auth, taskController.getUserTasks);

router.route("/tasks/:id").put(auth, taskController.updateSpecificTask);

router.route("/tasks/:id").delete(auth, taskController.deleteSpecificTask);

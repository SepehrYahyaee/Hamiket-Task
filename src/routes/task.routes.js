import express from "express";
import { taskController } from "../controllers/index.js";
import {
    auth,
    createTaskDto,
    updateTaskDto,
    deleteTaskDto,
} from "../middlewares/index.js";

export const router = express.Router(); // api/v1

router
    .route("/tasks")
    .post(auth, createTaskDto, taskController.createTask)
    .get(auth, taskController.getUserTasks);

router
    .route("/tasks/:id")
    .put(auth, updateTaskDto, taskController.updateSpecificTask);

router
    .route("/tasks/:id")
    .delete(auth, deleteTaskDto, taskController.deleteSpecificTask);

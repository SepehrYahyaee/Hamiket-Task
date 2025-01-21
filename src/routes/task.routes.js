import express from "express";
import { taskController } from "../controllers/index.js";
import {
    auth,
    createTaskDto,
    updateTaskDto,
    deleteTaskDto,
} from "../middlewares/index.js";
import { asyncErrorHandler } from "../utilities/index.js";

export const router = express.Router(); // api/v1

router
    .route("/tasks")
    .post(auth, createTaskDto, asyncErrorHandler(taskController.createTask))
    .get(auth, asyncErrorHandler(taskController.getUserTasks));

router
    .route("/tasks/:id")
    .put(
        auth,
        updateTaskDto,
        asyncErrorHandler(taskController.updateSpecificTask),
    );

router
    .route("/tasks/:id")
    .delete(
        auth,
        deleteTaskDto,
        asyncErrorHandler(taskController.deleteSpecificTask),
    );

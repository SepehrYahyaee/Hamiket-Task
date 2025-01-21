import { taskService } from "../services/index.js";
import { AppError, logger } from "../utilities/index.js";

class TaskController {
    static instance;

    constructor() {
        if (TaskController.instance) return TaskController.instance;
        TaskController.instance = this;
    }

    async createTask(req, res) {
        const { name, description } = req.body;
        const userId = req.user.id;

        const task = await taskService.insertTask(name, description, userId);

        res.status(201).send({
            data: {
                task,
            },
            success: true,
        });

        return logger.info(
            `New task with the id of ${task.id} has been created by user ${task.user_id}.`,
        );
    }

    async getUserTasks(req, res) {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1;
        const offset = (page - 1) * limit;
        const userId = req.user.userId;

        // Pagination
        const tasks = await taskService.retrieveAllTasksOfUser(
            userId,
            limit,
            offset,
        );
        const totalTasks = await taskService.countUserTasks(userId);
        const totalPages = Math.ceil(totalTasks / limit);

        return res.status(200).send({
            data: {
                tasks,
                totalTasks,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
            success: true,
        });
    }

    async updateSpecificTask(req, res) {
        const taskId = +req.params.id;
        const updateStatus = req.body.status;

        const task = await taskService.retrieveSpecificTask(taskId);
        if (!task) throw new AppError("Task does not exist!", 404);

        if (task.user_id !== req.user.id)
            throw new AppError("You are not the author of this task!", 401);

        const updatedTask = await taskService.modifySpecificTask(
            taskId,
            updateStatus,
        );

        res.status(200).send({
            data: {
                task: updatedTask,
            },
            success: true,
        });

        return logger.info(
            `Task ${task.id} status has been successfully updated to ${updatedTask.status}`,
        );
    }

    async deleteSpecificTask(req, res) {
        const taskId = +req.params.id;

        const task = await taskService.retrieveSpecificTask(taskId);
        if (!task) throw new AppError("Task does not exist!", 404);

        if (task.user_id !== req.user.id)
            throw new AppError("You are not the author of this task!", 401);

        const deletedTask = await taskService.removeSpecificTask(taskId);

        res.status(204).send({
            data: {
                task: deletedTask,
            },
            success: true,
        });

        return logger.info(`Task ${task.id} has been deleted by it's author.`);
    }
}

export const taskController = new TaskController();

import { taskService } from "../services/index.js";

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

        return res
            .status(201)
            .send(
                `Task "${task.name}" has been successfully created with id "${task.id}"`,
            );
    }

    async getUserTasks(req, res) {
        const userId = req.user.userId;

        const tasks = await taskService.retrieveAllTasksOfUser(userId);

        return res.status(200).send(tasks);
    }

    async updateSpecificTask(req, res) {
        const taskId = +req.params.id;
        const updateStatus = req.body.status;

        const task = await taskService.retrieveSpecificTask(taskId);
        if (!task) throw new Error("Task does not exist!");

        if (task.user_id !== req.user.id)
            throw new Error("You are not the author of this task!");

        const updatedTask = await taskService.modifySpecificTask(
            taskId,
            updateStatus,
        );

        return res.status(200).send(updatedTask);
    }

    async deleteSpecificTask(req, res) {
        const taskId = +req.params.id;

        const task = await taskService.retrieveSpecificTask(taskId);
        if (!task) throw new Error("Task does not exist!");

        if (task.user_id !== req.user.id)
            throw new Error("You are not the author of this task!");

        const deletedTask = await taskService.removeSpecificTask(taskId);

        return res
            .status(204)
            .send(`Task ${deletedTask.name} successfully got deleted!`);
    }
}

export const taskController = new TaskController();

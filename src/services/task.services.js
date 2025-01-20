import { prisma } from "../utilities/index.js";

class TaskService {
    #db = prisma;
    static instance;

    constructor() {
        if (TaskService.instance) return TaskService.instance;
        TaskService.instance = this;
    }

    insertTask(name, description, user_id) {
        return this.#db.task.create({
            data: {
                name,
                description,
                user_id,
            },
        });
    }

    retrieveAllTasksOfUser(user_id) {
        return this.#db.task.findMany({
            where: {
                user_id,
            },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
            },
        });
    }

    retrieveSpecificTask(taskId) {
        return this.#db.task.findUnique({
            where: {
                id: taskId,
            },
        });
    }

    modifySpecificTask(taskId, status) {
        return this.#db.task.update({
            where: {
                id: taskId,
            },
            data: {
                status,
            },
            select: {
                id: true,
                name: true,
                status: true,
            },
        });
    }

    removeSpecificTask(taskId) {
        return this.#db.task.delete({
            where: {
                id: taskId,
            },
        });
    }
}

export const taskService = new TaskService();

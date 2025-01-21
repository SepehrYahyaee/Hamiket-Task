import { body, param, validationResult, checkExact } from "express-validator";

export function validationErrorHandler(req, res, next) {
    try {
        const isValid = validationResult(req);
        if (!isValid.isEmpty()) {
            const message = isValid.errors[0].msg;
            throw new Error(message, 400);
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
}

export const registerDto = [
    body("userName")
        .isString()
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3, max: 32 })
        .withMessage("username validation error!"),
    body("password")
        .isString()
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 8, max: 24 })
        .withMessage("password validation error!"),
    checkExact(),
    validationErrorHandler,
];

export const loginDto = [
    body("userName")
        .isString()
        .trim()
        .escape()
        .notEmpty()
        .withMessage("username validation error!"),
    body("password")
        .isString()
        .trim()
        .escape()
        .notEmpty()
        .withMessage("password validation error!"),
    checkExact(),
    validationErrorHandler,
];

export const createTaskDto = [
    body("name")
        .isString()
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3, max: 255 })
        .withMessage("create task name validation error!"),
    body("description")
        .isString()
        .trim()
        .escape()
        .optional()
        .withMessage("create task description validation error!"),
    checkExact(),
    validationErrorHandler,
];

const StatusEnum = {
    PENDING: "Pending",
    INPROGRESS: "InProgress",
    COMPLETED: "Completed",
};

export const updateTaskDto = [
    body("status")
        .isString()
        .trim()
        .escape()
        .notEmpty()
        .isIn(Object.values(StatusEnum))
        .withMessage(
            `status must be one of the following: ${Object.values(StatusEnum).join(", ")}`,
        ),
    param("id").isInt().withMessage("id must be integer"),
    checkExact(),
    validationErrorHandler,
];

export const deleteTaskDto = [
    param("id").isInt().withMessage("id must be integer"),
    checkExact(),
    validationErrorHandler,
];

import * as pkg from "@prisma/client";
import { AppError, logger } from "./index.js";

const PrismaClientKnownRequestError = pkg.Prisma.PrismaClientKnownRequestError;
const PrismaClientValidationError = pkg.Prisma.PrismaClientValidationError;

export function globalErrorHandler(error, req, res, next) {
    if (error instanceof AppError) {
        error.statusCode = error.statusCode || 500;
        error.status = error.status || "error";

        logger.error(`Error: ${error.message}`);

        res.status(error.statusCode).send({
            status: error.statusCode,
            message: error.message,
            stack: error.stack.split("\n")[1],
        });
    } else if (error instanceof PrismaClientKnownRequestError) {
        const errorMessage = {
            mode: "DB prisma Error",
            code: error.code,
            message: error.message,
        };

        logger.error(`Error: ${error.message}`);

        res.status(500).send(errorMessage);
    } else if (error instanceof PrismaClientValidationError) {
        const errorMessage = {
            mode: "DB Validation Error",
            code: error.code,
            message: error.message,
        };

        logger.error(`Error: ${error.message}`);

        res.status(500).send(errorMessage);
    } else {
        logger.error(`Error: ${error.message}`);
        console.error("Critical Error:", error);
        res.status(500).send({ msg: error.message, stack: error.stack });
    }
}

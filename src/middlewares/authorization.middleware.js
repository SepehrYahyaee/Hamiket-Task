import jwt from "jsonwebtoken";
import { userService } from "../services/index.js";
import { AppError } from "../utilities/index.js";

export async function auth(req, res, next) {
    try {
        // If no bearer token has been provided, then it's not going to proceed.
        if (!req.headers.authorization)
            throw new AppError("Unauthorized!", 401);

        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        if (payload) {
            req.user = await userService.retrieveUserById(payload.id);
            next();
        } else {
            throw new AppError("Token is wrong!", 400);
        }
    } catch (error) {
        next(error);
    }
}

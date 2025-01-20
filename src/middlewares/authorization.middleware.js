import jwt from "jsonwebtoken";
import { userService } from "../services/index.js";

export async function auth(req, res, next) {
    try {
        // If no bearer token has been provided, then it's not going to proceed.
        if (!req.headers.authorization) throw new Error("Unauthorized!", 401);

        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        if (payload) {
            req.user = await userService.retrieveUserById(payload.id);
            next();
        } else {
            throw new Error("Token is wrong!", 400);
        }
    } catch (error) {
        next(error);
    }
}

import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { AppError } from "../utilities/index.js";

class UserProvider {
    static instance;

    constructor() {
        if (UserProvider.instance) return UserProvider.instance;
        UserProvider.instance = this;
    }

    hash(password) {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16).toString("hex");
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                const hash = `${salt}:${derivedKey.toString("hex")}`;
                resolve(hash);
            });
        });
    }

    verify(password, hash) {
        return new Promise((resolve, reject) => {
            const [salt, key] = hash.split(":");
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(key === derivedKey.toString("hex"));
            });
        });
    }

    createToken(payload, secretKey, expireTime) {
        try {
            const accessToken = jwt.sign(payload, secretKey, {
                expiresIn: expireTime,
            });
            return { accessToken };
        } catch (error) {
            throw new AppError("Failed to create the access token!", 500);
        }
    }
}

export const userProvider = new UserProvider();

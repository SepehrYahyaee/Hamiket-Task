import { prisma } from "../utilities/index.js";

class UserService {
    #db = prisma;
    static instance;

    constructor() {
        if (UserService.instance) return UserService.instance;
        UserService.instance = this;
    }

    insertUser(user_name, password) {
        return this.#db.user.create({
            data: {
                user_name,
                password_hash: password,
            },
        });
    }

    retrieveUserById(user_id) {
        return this.#db.user.findUnique({
            where: {
                id: user_id,
            },
        });
    }

    retrieveUserByUsername(user_name) {
        return this.#db.user.findUnique({
            where: {
                user_name,
            },
        });
    }
}

export const userService = new UserService();

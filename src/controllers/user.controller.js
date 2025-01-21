import { userProvider } from "../providers/index.js";
import { userService } from "../services/index.js";
import { AppError, logger } from "../utilities/index.js";

class UserController {
    static instance;

    constructor() {
        if (UserController.instance) return UserController.instance;
        UserController.instance = this;
    }

    async register(req, res) {
        const { userName, password } = req.body;

        // If username already exists, return an error.
        const user = await userService.retrieveUserByUsername(userName);
        if (user) throw new AppError("Username is already in use!", 409);

        // Hash the password and then create the user.
        const hash = await userProvider.hash(password);
        const createdUser = await userService.insertUser(userName, hash);

        res.status(201).send(
            `A user with username "${createdUser.user_name}" has successfully created!`,
        );

        return logger.info(
            `A new user named "${req.body.userName}" registered.`,
        );
    }

    async login(req, res) {
        const { userName, password } = req.body;

        // Check if the entered username and password matches.
        const user = await userService.retrieveUserByUsername(userName);
        if (!user)
            throw new AppError("Username or password does not match!", 400);

        const verify = await userProvider.verify(password, user.password_hash);
        if (!verify)
            throw new AppError("Username or password does not match!", 400);

        // If it matches and passess the errors above, create the access token.
        const token = userProvider.createToken(
            { id: user.id },
            process.env.SECRET_KEY,
            process.env.ACCESS_TOKEN_EXPIRE_TIME,
        );

        res.status(200).send(token);

        return logger.info(`"${user.user_name}" has logged in.`);
    }
}

export const userController = new UserController();

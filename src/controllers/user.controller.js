import { userService } from "../services/index.js";
import { userProvider } from "../providers/index.js";

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
        if (user) throw new Error("Username is already in use!");

        // Hash the password and then create the user.
        const hash = await userProvider.hash(password);
        const createdUser = await userService.insertUser(userName, hash);

        return res
            .status(201)
            .send(
                `A user with username "${createdUser.user_name}" has successfully created!`,
            );
    }

    async login(req, res) {
        const { userName, password } = req.body;

        // Check if the entered username and password matches.
        const user = await userService.retrieveUserByUsername(userName);
        if (!user) throw new Error("Username or password does not match!");

        const verify = await userProvider.verify(password, user.password_hash);
        if (!verify) throw new Error("Username or password does not match!");

        // If it matches and passess the errors above, create the access token.
        const token = userProvider.createToken(
            { id: user.id },
            process.env.SECRET_KEY,
            process.env.ACCESS_TOKEN_EXPIRE_TIME,
        );

        return res.status(200).send(token);
    }
}

export const userController = new UserController();

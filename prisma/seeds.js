import crypto from "node:crypto";
import { userProvider } from "../src/providers/index.js";
import { prisma } from "../src/utilities/index.js";

const uuid = crypto.randomUUID();

const users = [
    {
        id: uuid,
        userName: "Hasan",
        password: "12345678",
    },
];

async function main() {
    await prisma.user.deleteMany({});
    await prisma.task.deleteMany({});

    for (const user of users) {
        await prisma.user.create({
            data: {
                id: user.id,
                user_name: user.userName,
                password_hash: await userProvider.hash(user.password),
            },
        });
    }

    await prisma.task.create({
        data: {
            name: "New task",
            description: "A sample description for this task",
            user_id: uuid,
        },
    });
}

main();

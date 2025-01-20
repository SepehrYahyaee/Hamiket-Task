import express from "express";
import { userRoutes, taskRoutes } from "./routes/index.js";

const app = express();

// Accept JSON inputs and outputs
app.use(express.json());

// Routing
app.use("/api/v1", userRoutes);
app.use("/api/v1", taskRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Welcome!");
});

// Listening on requests
app.listen(process.env.PORT, () =>
    console.log(`Server is running on: http://localhost:${process.env.PORT}`),
);

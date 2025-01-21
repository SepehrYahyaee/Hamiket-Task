import express from "express";
import morgan from "morgan";
import { userRoutes, taskRoutes } from "./routes/index.js";
import { globalErrorHandler, logger } from "./utilities/index.js";

const app = express();

// Accept JSON inputs and outputs
app.use(express.json());

// Logger ( combining morgan auto logging with winston level logging )
app.use(
    morgan("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
    }),
);

// Routing
app.use("/api/v1", userRoutes);
app.use("/api/v1", taskRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Welcome!");
});

// Global error handler
app.use(globalErrorHandler);

// Listening on requests
app.listen(process.env.PORT, () =>
    console.log(`Server is running on: http://localhost:${process.env.PORT}`),
);

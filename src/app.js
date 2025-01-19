import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome!");
});

app.listen(process.env.PORT, () =>
    console.log(`Server is running on: http://localhost:${process.env.PORT}`),
);

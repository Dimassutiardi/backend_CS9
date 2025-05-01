// app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(`/user`, require(`./src/routes/user.route`));
app.use(`/store`, require(`./src/routes/store.route`));
app.use(`/item`, require(`./src/routes/item.route`));
app.use(`/transaction`, require(`./src/routes/transaction.route`));

// Default route
app.get("/", (req, res) => {
res.send("API is running...");
});

// 404 handler
app.use((req, res, next) => {
const error = new Error("Not Found");
error.status = 404;
next(error);
});

// Global error handler
app.use((err, req, res, next) => {
console.error("Error:", err.message);
res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null
});
});

module.exports = app;


const express = require("express");
const authRouters = require("./routes/authRoutes")
const app = express();

app.use(express.json());

app.use("/api/v1/auth",authRouters)


module.exports = app;
const express = require("express");
const authRouters = require("./routes/authRoutes")
const userRouters = require("./routes/userRoutes")
const adminRouters = require("./routes/adminRoutes")
const publicRouters = require("./routes/publicRoutes")
const app = express();

app.use(express.json());

app.use("/api/v1/auth",authRouters)
app.use("/api/v1/user",userRouters)
app.use("/api/v1/admin",adminRouters)
app.use("/api/v1/public",publicRouters)


app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(err.status||500).json({ error: err.message || 'Internal Server Error' });
})


module.exports = app;
const express = require("express");
const authRouters = require("./routes/authRoutes")
const userRouters = require("./routes/userRoutes")
const app = express();

app.use(express.json());

app.use("/api/v1/auth",authRouters)
app.use("/api/v1/user",userRouters)


app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
})


module.exports = app;
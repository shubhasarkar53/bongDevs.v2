require("dotenv").config();
const app = require("./app");
const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./database/db");
const port = process.env.PORT;


connectDb().then(()=>{
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
  console.log("Database sucessfully connected");
})
.catch((err)=>{
  console.log(err);
})



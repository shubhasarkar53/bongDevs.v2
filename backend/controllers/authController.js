const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const BlackList = require("../models/BlackList");

// :::::SCOPE::::::: 
// Create Servcies to make it more clean
// :::::SCOPE::::::: 

exports.signUp = async (req, res) => {
  try {
    //Take input usnername password
    const { username, password } = req.body;
    //validate username pass
    //check if already exist
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exist! please log in",
      });
    }

    //::::::SCOPE:::::
    //::::::SCOPE:::::

    // Add an email/phone varify system
    // Mail send after signup

    //::::::SCOPE:::::

    //cretae an enty into db if new user
    const newUser = new User({
      username,
      password, //password already hased in db
      roles: ["user"], // default role
    });

    await newUser.save();

    //generate jwt token
    const token = newUser.generateAccessToken();

    //call the setcookie fun
    setCookie(token);

    // set cookie funtion def
    function setCookie(token) {
      const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 100
        ), //from hours to milisec
        httpOnly: true,
        withCredientials: true,
      };
      res.cookie("SessionID", token, options);
    }

    //return resp
    return res.status(201).json({
      message: "User registered successfully",
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.log("Error register controller:" + error);
    return res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    //generate jwt token

    const token = user.generateAccessToken();

    // set cookie funtion def
    function setCookie(token) {
      const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 100
        ), //from hours to milisec
        httpOnly: true,
        withCredientials: true,
      };
      res.cookie("SessionID", token, options);
    }
    //call the setcookie fun
    setCookie(token);

    // Send token as response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: user.toJSON(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error logging in", error });
  }
};

exports.logout = async (req, res) => {
  try {
    // get the cookie preset in browser
    const authHeader = req.headers["cookie"];
    if (!authHeader) return res.sendStatus(204);
    const cookie = authHeader.split("=")[1];
    const accessToken = cookie.split(";")[0];
    console.log(accessToken);
    //clear the cookie from the client

    //backend extra security
    //As soon as logout
    //check if the current token is blacklisted
    const checkIfBlacklisted = await BlackList.findOne({ token: accessToken });
    if (checkIfBlacklisted) return res.sendStatus(204);
    //1. blacklist the current user token
    const newBlacklist = new BlackList({
      token: accessToken,
    });
    await newBlacklist.save();
    //2. store blacklisted token in db

    // Also clear request cookie on client
    res.setHeader("Clear-Site-Data", '"cookies"');
    res.clearCookie("SessionID");
    res.status(200).json({ message: "You are logged out!" });
  } catch (error) {}
};



exports.forgotPassword = () => {};

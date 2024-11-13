const express = require("express");

const { check } = require("express-validator"); // assuming you have this middleware
const { signUpController, loginController, logoutController } = require("../controllers/authController");
const Validate = require("../middlewares/validate");

const router = express.Router();

// Implementing the validation here
//:::::::SCOPE::::::::
// CAN WE CREATE A EXTRA GENERIC MIDDLEWARE FOR THE VALIDATION TO MAKE THE CODE CLEAN
//:::::::SCOPE::::::::

router.post(
  "/signup",
  check("username")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Must be at least 8 chars long"),
  Validate, // custom middleware to handle validation errors
  signUpController
);

// Login route
router.post(
  "/login",
  Validate,
  loginController
);
// Logout route
router.get(
  "/logout",
  logoutController
);

module.exports = router;

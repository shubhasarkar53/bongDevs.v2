const express = require("express");
const { myProfile } = require("../controllers/userController");
const { authenticateUser, authRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// Logout route
router.get("/test", authenticateUser , authRole("admin"),myProfile);

module.exports = router;

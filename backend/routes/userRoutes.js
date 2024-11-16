const express = require("express");
const { myProfile } = require("../controllers/userController");
const { authenticateUser, authRole } = require("../middlewares/authMiddleware");
const courseControllers = require("../controllers/courseController")
const router = express.Router();

// Logout route
router.get("/test", authenticateUser , authRole("admin"),myProfile);

//:::::::::@ADMIN::::::::::
//:::COURSE RELATED ROUTES:::

// POST - /admin/new-course
router.get("/admin/new-course", authenticateUser , authRole("admin"),courseControllers.createCourse);

module.exports = router;

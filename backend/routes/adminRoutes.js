const express = require("express");
const { authenticateUser, authRole } = require("../middlewares/authMiddleware");
const courseControllers = require("../controllers/courseController")
const router = express.Router();

//:::::::::@ADMIN::::::::::
//:::COURSE RELATED ROUTES:::

// POST - /admin/new-course
router.post("/new-course", authenticateUser , authRole("admin"),courseControllers.createCourse);

// GET - /admin/your-courses
router.get("/your-courses", authenticateUser , authRole("admin"),courseControllers.getYourCreatedCourses);

// PATCH /admin/course/:id
router.patch("/course/:id", authenticateUser , authRole("admin"),courseControllers.updateCourse);

// ::::::::::ADMIN/SUPER ADMIN::::::::::
//DELETE course
router.delete("/course/:id", authenticateUser , authRole("admin","superAdmin"),courseControllers.deleteCourseHard);

module.exports = router;

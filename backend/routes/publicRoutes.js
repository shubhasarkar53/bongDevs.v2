const express = require("express");
const courseControllers = require("../controllers/courseController")
const router = express.Router();

//:::::::::@PUBLIC::::::::::


//:::COURSE RELATED ROUTES:::

// GET- all published courses
router.get("/published-courses", courseControllers.getAllPublishedCourses);
// GET- get course details
router.get("/course/:id", courseControllers.getCourseDetails);



module.exports = router;

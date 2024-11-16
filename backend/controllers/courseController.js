const { z } = require("zod");
const courseServices = require("../services/course");

// Get all published Courses ::::PUBLIC:::::::
exports.getAllPublishedCourses = async (req, res, next) => {
  try {
    // find courses where isPublished:true matches using the service
    const courses = await courseServices.findCoursesByProperty({
      prop: "isPublished",
      value: true,
    });

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No course has been published yet!" });
    }

    // Admin's list of courses
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      courses: courses,
    });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    next(error);
  }
};

// Get details of Course by ID ::::PUBLIC:::::::
exports.getCourseDetails = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a course id" });
    }
    // find courses where isPublished:true matches using the service
    const course = await courseServices.findCourseByProperty({
      prop: "_id",
      value: courseId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course doesn't exist!" });
    }

    // Admin's list of courses
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      course: course,
    });
  } catch (error) {
    console.error("Error retrieving course::", error);
    next(error);
  }
};

// ::::PRIVATE::::::

// -  createCourse :::ADMIN:::
exports.createCourse = async (req, res, next) => {
  try {
    const { createdBy = req.body.createdBy || req.user._id, ...courseData } =
      req.body;
    const savedCourse = await courseServices.createCourse(
      courseData,
      createdBy
    );

    if (!savedCourse) {
      return res.status(400).json({
        success: false,
        message: "Course creation failed!",
      });
    }

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.error("Error creating course::");
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    next(error);
  }
};

// Get all Courses Created by the Admin  :::ADMIN:::
exports.getYourCreatedCourses = async (req, res, next) => {
  try {
    //logged im admin id
    const adminId = req.user._id;

    // find courses where createdBy matches the admin's ID using the service
    const courses = await courseServices.findCoursesByProperty({
      prop: "createdBy",
      value: adminId,
    });

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found for this admin." });
    }

    // Admin's list of courses
    res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      courses: courses,
    });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    next(error);
  }
};

// Update course by id
exports.updateCourse = async (req, res, next) => {
  const courseId = req.params.id;
  const updates = req.body;
  const adminId = req.user._id;
  const userRoles = req.user.roles;
  if (!courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a course id" });
  }
  
  try {
    const course = await courseServices.findCourseByProperty({
      prop: "_id",
      value: courseId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course doesn't exist!" });
    }

    //Update the course using the send body
    const updatedCourse = await courseServices.editCourseData({currentCourse:course,updates:updates,adminId:adminId,roles:userRoles});

    res.status(200).json({
      success: true,
      message: "Courses Updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }

    console.error("Error updating course::", error);
    next(error);
  }
};

// - deleteCourse (Hard) for admin and superAdmin as well
exports.deleteCourseHard = async (req, res, next) => {
  const courseId = req.params.id;
  const adminId = req.user._id ;
  const userRoles = req.user.roles; 

  if (!courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a course id" });
  }

  try {
    const course = await courseServices.findCourseByProperty({
      prop: "_id",
      value: courseId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course doesn't exist!" });
    }

    //delete the course
    await courseServices.deleteCourse({currentCourse:course,adminId:adminId,roles:userRoles});

    //:::::::::::::SCOPE::::::::::::
    //Send email for refund the user who bought the course


    res.status(200).json({
      success: true,
      message: "Courses deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course::", error);
    next(error);
  }
};


// - [ ]  deleteCourse (Soft)
exports.deleteCourseSoft = () => {};
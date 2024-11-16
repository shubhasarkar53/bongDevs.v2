const Course = require("../models/Course");
const {
  updateCourseSchema,
  createCourseSchema,
} = require("../validators/courseValidators");

// find a course by property
const findCourseByProperty = ({ prop, value }) => {
  if (prop == "_id") {
    const course = Course.findById(value);
    return course;
  } else {
    const course = Course.findOne({ [prop]: value });
    return course;
  }
};

// find  Courses by property
const findCoursesByProperty = ({ prop, value }) => {
  if (prop == "_id") {
    const course = Course.findById(value);
    return course;
  } else {
    const courses = Course.find({ [prop]: value });
    return courses;
  }
};

// purchase a course  :::::😩INCOMPLETE::::::
const purchaseCourseById = (id) => {
  const courseId = id;
  //:::: IMPLEMENT THE PAYMENT LOGIC:::::
  //FOR NOW RETURN TRUE
  return true;
};


//create a course
const createCourse = (courseData, admin) => {

//append the admin id into the course data
  const finalCourseData = { ...courseData, createdBy: admin.toString() };

  //validate first
  const validatedData = createCourseSchema.parse(finalCourseData);
  //create an entry into db
  const newCourse = new Course(validatedData);
  const savedCourse = newCourse.save();
  return savedCourse;
};

//update course
const editCourseData = ({currentCourse, updates,adminId,roles}) => {


  //check if this course is cretaed by this admin
  const isValidAdmin = currentCourse.createdBy.toString() == adminId.toString();

  //if the user is a super admin
  const isSuperAdmin = roles.includes("superAdmin") 

  if(!isValidAdmin && !isSuperAdmin){
    const error = new Error("You can't access this resource");
      error.status = 401;
      throw error;
  }

  //validate using zod
  const validatedData = updateCourseSchema.parse(updates);

  // update logic
  Object.keys(validatedData).forEach((key) => {
    // Special handling for sections
    if (key === "sections" && Array.isArray(validatedData.sections)) {
      currentCourse.sections = validatedData.sections;
    } else {
      currentCourse[key] = validatedData[key];
    }
  });

  //  Save the updated course
  return currentCourse.save();
};

const deleteCourse = ({currentCourse,adminId,roles}) => {

    //check if this course is cretaed by this admin

    console.log("currentCourse.createdBy",currentCourse.createdBy)
    console.log("adminId",adminId)
    const isValidAdmin = currentCourse.createdBy.toString() == adminId.toString();

    //if the user is a super admin
    const isSuperAdmin = roles.includes("superAdmin") 
  
    if(!isValidAdmin && !isSuperAdmin){
      const error = new Error("You can't access this resource");
        error.status = 401;
        throw error;
    }

  return Course.findByIdAndDelete(currentCourse._id);
}
module.exports = {
  findCourseByProperty,
  purchaseCourseById,
  createCourse,
  findCoursesByProperty,
  editCourseData,
  deleteCourse
};

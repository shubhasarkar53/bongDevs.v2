const courseServices = require("../services/course")


exports.myProfile = (req,res,next) =>{
    res.status(200).json({
        status: "success",
        message: "Welcome to the your Dashboard!",
    });
}


// - [ ]  purchaseCourse
// - [ ]  getPurchasedCourses
// - [ ]  becomeAnAdmin

exports.purchaseCourse = async (req,res,next) =>{
    try {
        //get the id of course
        const courseId = req.params.id;
        //find if course exist
        const course = await courseServices.findCourseByProperty({prop:"_id",value:courseId})
        if(!course){
            return res.status(404).json({
                success:false,
                message:"Invalid Course id."
            })
        }
        //make payment 
        const isPaid = courseServices.purchaseCourseById(courseId);
        //check if payment is done
        if(!isPaid){
            return res.status(400).json({
                success:false,
                message:"Payment Failed, please try again after some time!"
            })
        }

        //push the course id into the user's purchased course array
        req.user.purchasedCourses.push(courseId);
        //return resp
    } catch (error) {
        console.log("Purchase course controller Error::")
        next(error)
    }
}

exports.getPurchasedCourses = (req,res,next) =>{
    
}

exports.becomeAnAdmin = (req,res,next) =>{
    
}


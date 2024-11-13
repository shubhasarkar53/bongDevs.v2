const { setCookie } = require("../utils/cookie");
const { signUpService, loginService, logoutService } = require("../services/auth");


exports.signUpController = async (req, res, next) => {
  try {
    //Take input usnername password
    const { username, password } = req.body;

    //validate username pass
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid data",
      });
    }

    //Create a fresh user
    const newUser = await signUpService({ username, password });

    //generate jwt token
    const accessToken = await newUser.generateAccessToken();

    if(!accessToken){
      return res.status(401).json({
        success: false,
        message: "Login token can't be generated, something went wrong!",
      });
    }

    //call the setcookie fun
    setCookie(res, accessToken);

    //return resp
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.log("Error register controller:" + error.message);
    next(error);
  }
};

exports.loginController = async (req, res,next) => {
  try {
    const { username, password } = req.body;

     //validate username pass
     if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid data",
      });
    }

    //Login and get the login token using login service
    const accessToken = await loginService({username:username,password:password});
    if(!accessToken){
      return res.status(401).json({
        success: false,
        message: "Login token can't be generated, something went wrong!",
      });
    }

    //set the cookie
    setCookie(res, accessToken);

    // Send token as response
    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log("Error login controller:" + error.message);
    next(error);
  }
};

exports.logoutController = async (req, res,next) => {
  try {
    // get the cookie preset in browser
    const authHeader = req.headers["cookie"];
    if (!authHeader) return res.sendStatus(204);
    const isLoggedOut = logoutService({authHeader});
    // Also clear request cookie on client
    if(isLoggedOut){
      res.setHeader("Clear-Site-Data", '"cookies"');
      res.clearCookie("SessionID");
      return res.status(200).json({ success:true, message: "You are logged out!" });
    }
    
  } catch (error) {
    console.log("error in logout:" + error);
    next(error);
  }
};

exports.forgotPassword = () => {};

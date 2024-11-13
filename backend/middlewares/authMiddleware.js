const { findIsBlackListed } = require("../services/blackList");
const jwt = require("jsonwebtoken");
const { findUserByProperty } = require("../services/user");

// Authentication middleware
exports.authenticateUser = async (req, res, next) => {
  try {
    //take the cookie from the browser
    console.log("inidoe authuser");
    const authHeader = req.headers["cookie"];
    if (!authHeader) {
      const error = new Error("auth header not found");
      error.status = 204;
      throw error;
    }

    //take out the token from it
    const cookie = authHeader.split("=")[1];
    const accessToken = cookie.split(";")[0];
    console.log("accessToken:  " + accessToken);

    //checl if it is blacklisted or not
    const isBlacklisted = await findIsBlackListed(accessToken);
    if (isBlacklisted) {
      const error = new Error("BlackListed Token used.");
      error.status = 204;
      throw error;
    }

    //if not blackilisted verify the token with jwt verfity making sure if it is altered or not
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      async (error, decodedUserId) => {
        if (error) {
          return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
        }
        const { userId } = decodedUserId;
        //find the user using decoded _id
        // get the user object
        const user = await findUserByProperty({ prop: "_id", value: userId });

        if (!user) {
          const error = new Error("User not found.");
          error.status = 404;
          throw error;
        }

        //make sure remove the password
        const finalUserData = user.toJSON();

        // embade the user object into the req for future usage in routes
        req.user = finalUserData;
        next();
      }
    );
  } catch (error) {
    console.log("Autheticate middlerware Error::");
    next(error);
  }
};

// Authorization middleware
exports.authRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const { roles } = req.user;

      // Check if the user has at least one of the allowed roles
      const hasAllowedRole = roles.some((role) => allowedRoles.includes(role));
      if (!hasAllowedRole) {
        const error = new Error(
          "Access denied, you arn't eligible to see this resource."
        );
        error.status = 401;
        throw error;
      }

      next();
    } catch (error) {
      console.log("auth role error::");
      next(error);
    }
  };
};

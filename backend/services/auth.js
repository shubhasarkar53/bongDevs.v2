const { findIsBlackListed, blackListToken } = require("./blackList");
const { findUserByProperty, createFreshUser } = require("./user");
const bcrypt = require("bcrypt");

exports.signUpService = async ({ username, password }) => {
  //check if already exist
  const existingUser = await findUserByProperty({
    prop: "username",
    value: username,
  });
  if (existingUser) {
    const error = new Error("User already exist! please log in");
    error.status = 400;
    throw error;
  }

  //cretae an enty into db if new user
  return await createFreshUser({ username, password });
};

exports.loginService = async ({ username, password }) => {
  // Find user by username
  const user = await findUserByProperty({ prop: "username", value: username });
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  //generate jwt token
  const token = await user.generateAccessToken();

  return token;
};

exports.logoutService = async ({ authHeader }) => {
  const cookie = authHeader.split("=")[1];
  const accessToken = cookie.split(";")[0];
  //backend extra security
  //As soon as logout
  //check if the current token is blacklisted
  const checkIfBlacklisted = await findIsBlackListed(accessToken);
  if (checkIfBlacklisted) {
    const error = new Error("BlackListed Token used.");
    error.status = 204;
    throw error;
  }

  const balacklistedToken = await blackListToken(accessToken);
  if (balacklistedToken) {
    return true;
  } else {
    return false;
  }
};

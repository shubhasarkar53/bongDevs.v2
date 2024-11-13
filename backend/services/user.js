const User = require("../models/User");

const findUserByProperty = ({ prop, value }) => {
  if (prop == "_id") {
    const user = User.findById(value);
    return user;
  } else {

    const user = User.findOne({ [prop]: value });
    // console.log(user);
    return user;
  }
};

const createFreshUser = ({ username, password }) => {
  //cretae an enty into db if new user
  const newUser = new User({
    username,
    password, //password already hased in db
    roles: ["user"], // default role
  });

  return newUser.save();
};

module.exports = { findUserByProperty,createFreshUser };

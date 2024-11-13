const BlackList = require("../models/BlackList");

const findIsBlackListed = (accessToken) => {
    const checkIfBlacklisted = BlackList.findOne({ token: accessToken });
    return checkIfBlacklisted;
}

const blackListToken = (accessToken) =>{
  //1. blacklist the current user token
  const newBlacklist = new BlackList({
    token: accessToken,
  });
  return newBlacklist.save();
}


module.exports = {findIsBlackListed,blackListToken}
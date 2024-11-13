
  // set cookie funtion def
const setCookie = (res,token) => {
    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 100), //from hours to milisec
      httpOnly: true,
      withCredientials: true,
    };
    res.cookie("SessionID", token, options);
  }

module.exports = {setCookie};
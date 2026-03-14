const jwt = require("jsonwebtoken");

// Check user login or not
const isUserLogin = async (req, res, next) => {
  try {
    const requestToken =
      req.cookies?.refreshToken || req.headers?.authorization?.split(" ")[1];
    if (!requestToken) {
      return res.status(401).json({
        success: false,
        message: "User not logged in",
      });
    }
    const decode = jwt.verify(requestToken, process.env.REFRESH_JWT_SECRET);
    req.user = decode;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User not logged in",
    });
  }
};

const isAccessTokenValid = (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }
    const decode = jwt.verify(accessToken, process.env.ACCESS_JWT_SECRET);
    req.user = decode;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      code: "INVALID_OR_EXPIRED_TOKEN",
      success: false,
      message: "Invalid or expired access token",
    });
  }
};

module.exports = {
  isUserLogin,
  isAccessTokenValid,
};

import BlackList from "../models/auth/blackListToken.model.js";
import User from "../models/auth/user.model.js";
import AppError from "./AppError.middleware.js";
import jwt from "jsonwebtoken";

const isUserLogin = async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  const refreshToken =
    req.cookies.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new AppError(401, "User not logged in", true);
  }

  if (!refreshToken) {
    throw new AppError(401, "User not logged in", true);
  }

  const blackListToken = await BlackList.findOne({
    $or: [{ accessToken }, { refreshToken }],
  });

  if (blackListToken) {
    throw new AppError(401, "User not logged in", true);
  }
  try {
    const decode = jwt.verify(accessToken, process.env.JWT_SECRET);

    const userId = decode.id;
    const user = await User.findById(userId);

    if (!user.isAccountActive) {
      throw new AppError(
        403,
        "Account is deactivated. Please activate your account to perform this action.",
        true,
      );
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Access token expired",
      code: "ACCESS_TOKEN_EXPIRES",
      success: false,
    });
  }
};

export default isUserLogin;

import BlackList from "../models/auth/blackListToken.model.js";
import User from "../models/auth/user.model.js";
import AppError from "./AppError.middleware.js";
import jwt from "jsonwebtoken";

const isUserLogin = async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  const refreshToken =
    req.cookies?.refreshToken ||
    req.header("x-refresh-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken && !refreshToken) {
    throw new AppError(401, "User not logged in", true);
  }

  // Check blacklist
  if (accessToken || refreshToken) {
    const blackListToken = await BlackList.findOne({
      $or: [
        ...(accessToken ? [{ accessToken }] : []),
        ...(refreshToken ? [{ refreshToken }] : []),
      ],
    });

    if (blackListToken) {
      throw new AppError(401, "User not logged in", true);
    }
  }

  try {
    const tokenToDecode = accessToken || refreshToken;
    const secret = accessToken
      ? process.env.JWT_SECRET
      : process.env.JWT_REFRESH_SECRET;

    const decode = jwt.verify(tokenToDecode, secret);

    const userId = decode.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found", true);
    }

    if (!user.isAccountActive) {
      throw new AppError(
        403,
        "Account is deactivated. Please activate your account to perform this action.",
        true
      );
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Access token expired or invalid",
      code: "ACCESS_TOKEN_EXPIRES",
      success: false,
    });
  }
};

export default isUserLogin;

const jwt = require("jsonwebtoken");
const { ApiError } = require("../middleware/errors.middleware");

const getRefreshToken = (user) => {
  try {
    const token = jwt.sign({ id: user.id }, process.env.REFRESH_JWT_SECRET, {
      expiresIn: "7d",
    });
    return token;
  } catch (error) {
    throw new ApiError(
      "Failed to generate refresh token",
      500,
      "JWT_TOKEN_GENERATION_FAILED",
      {
        error: error.message,
      },
    );
  }
};

const getAccessToken = (user) => {
  try {
    const token = jwt.sign({ id: user.id }, process.env.ACCESS_JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    throw new ApiError(
      "Failed to generate access token",
      500,
      "JWT_TOKEN_GENERATION_FAILED",
      {
        error: error.message,
      },
    );
  }
};

module.exports = { getRefreshToken, getAccessToken };

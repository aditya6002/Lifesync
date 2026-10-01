import { validationResult } from "express-validator";
import AppError from "./AppError.middleware.js";

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractErrMsg = errors.array[0].msg;

  throw new AppError(400, extractErrMsg, true);
};

export default validate;

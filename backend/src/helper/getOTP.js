import crypto from "crypto";

const getOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export default getOtp;

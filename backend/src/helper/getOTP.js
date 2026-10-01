import crypto from "crypto";

const getOtp = async () => {
  return await crypto.randomInt(100000, 999999).toString();
};

export default getOtp;

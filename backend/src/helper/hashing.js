const crypto = require("crypto");

function encryptString(data, secret) {
  const cipher = crypto.createCipher("aes-256-cbc", secret);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decryptString(encryptedData, secret) {
  const decipher = crypto.createDecipher("aes-256-cbc", secret);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = {
  encryptString,
  decryptString,
};

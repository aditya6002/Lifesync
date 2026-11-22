
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

// Encryption configuration
const algorithm = "aes-256-gcm";
const IV_LENGTH = 12; // Recommended nonce length for GCM
const KEY_LENGTH = 32; // 256-bit key
const ENCRYPTION_VERSION = "v1";

function deriveKey(userId) {
  const masterSecret = process.env.CRYPTO_SECRET_KEY;

  if (!masterSecret) {
    throw new Error("CRYPTO_SECRET_KEY is missing");
  }

  if (!/^[0-9a-fA-F]{64}$/.test(masterSecret)) {
    throw new Error(
      "CRYPTO_SECRET_KEY must be exactly 64 hexadecimal characters (32 bytes)"
    );
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const masterKey = Buffer.from(masterSecret, "hex");

  const salt = Buffer.from(String(userId), "utf8");

  const info = Buffer.from("LifeSync-journal-encryption-v1", "utf8");

  const derivedKey = crypto.hkdfSync(
    "sha256",
    masterKey,
    salt,
    info,
    KEY_LENGTH
  );

  return Buffer.from(derivedKey);
}

// Encrypt
function encrypt(text, userId) {
  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }

  if (!userId) {
    throw new Error("User ID is required for encryption");
  }

  const securityKey = deriveKey(userId);

  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(algorithm, securityKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");

  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return [
    ENCRYPTION_VERSION,
    iv.toString("hex"),
    encrypted,
    authTag.toString("hex"),
  ].join(":");
}

// Decrypt 
function decrypt(encryptedText, userId) {
  if (typeof encryptedText !== "string" || !encryptedText) {
    throw new Error("Encrypted text must be a non-empty string");
  }

  if (!userId) {
    throw new Error("User ID is required for decryption");
  }

  const parts = encryptedText.split(":");

  if (parts.length !== 4) {
    throw new Error("Invalid encrypted data format");
  }

  const [version, ivHex, encryptedData, authTagHex] = parts;

  if (version !== ENCRYPTION_VERSION) {
    throw new Error("Unsupported encryption version");
  }

  if (
    !/^[0-9a-fA-F]{24}$/.test(ivHex) ||
    !/^[0-9a-fA-F]*$/.test(encryptedData) ||
    encryptedData.length % 2 !== 0 ||
    !/^[0-9a-fA-F]{32}$/.test(authTagHex)
  ) {
    throw new Error("Invalid encrypted data");
  }

  const securityKey = deriveKey(userId);

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, securityKey, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
}

export { encrypt, decrypt };
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const hashPassword = async (password) => bcrypt.hash(password, 12);

export const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

export const comparePasswordFlexible = async (plain, storedHash) => {
  if (!storedHash) return false;
  if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
    return bcrypt.compare(plain, storedHash);
  }
  if (/^[a-f0-9]{64}$/i.test(storedHash)) {
    return sha256(plain) === storedHash.toLowerCase();
  }
  return plain === storedHash;
};

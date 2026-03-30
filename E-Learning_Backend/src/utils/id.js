import crypto from "crypto";

export const generateCode = (prefix, size = 8) => {
  const raw = crypto.randomBytes(size).toString("hex").toUpperCase();
  return `${prefix}${raw.slice(0, size)}`;
};

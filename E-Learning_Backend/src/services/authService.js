import jwt from "jsonwebtoken";
import { comparePasswordFlexible } from "../utils/password.js";
import * as authRepository from "../repository/authRepository.js";

const buildLearnerPayload = (account) => ({
  accountNumber: account.Account_Number,
  username: account.Account_Username,
  role: account.Account_Roles,
  status: account.Account_Status,
  learnerId: account.Learner_ID,
  fullName: account.Learner_Full_Name,
  email: account.Learner_Email_Address
});

export const loginLearner = async ({ username, password }) => {
  const normalizedUsername = String(username || "").trim();
  const normalizedPassword = String(password || "");

  if (!normalizedUsername || !normalizedPassword) {
    const error = new Error("username and password are required.");
    error.status = 400;
    throw error;
  }

  const account = await authRepository.findAccountForLogin(normalizedUsername);
  if (!account) {
    const error = new Error("Invalid username or password.");
    error.status = 401;
    throw error;
  }

  const validPassword = await comparePasswordFlexible(normalizedPassword, account.Account_Password);
  if (!validPassword) {
    const error = new Error("Invalid username or password.");
    error.status = 401;
    throw error;
  }

  if (String(account.Account_Status).toLowerCase() !== "active") {
    const error = new Error("Account is not active.");
    error.status = 403;
    throw error;
  }

  if (String(account.Account_Roles) !== "Learner") {
    const error = new Error("This login is only available for learner accounts.");
    error.status = 403;
    throw error;
  }

  if (!account.Learner_ID) {
    const error = new Error("Learner profile not found for this account.");
    error.status = 404;
    throw error;
  }

  const user = buildLearnerPayload(account);
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

  return {
    message: "Login successful.",
    token,
    user
  };
};
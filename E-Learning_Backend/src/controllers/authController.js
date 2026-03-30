import * as authService from "../services/authService.js";

export const login = async (req, res, next) => {
  try {
    const data = await authService.loginLearner(req.body || {});
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

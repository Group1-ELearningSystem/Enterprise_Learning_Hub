import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddlewares.js";
import { changePasswordController, loginController, registerController, verifyController } from "../controllers/accountController.js";

const router = express.Router()

router.post("/login", loginController)
router.post("/register", registerController)
router.post("/verify-email", verifyController)
router.post("/change-password", verifyToken, authorizeRoles("Instructor"), changePasswordController)

export default router
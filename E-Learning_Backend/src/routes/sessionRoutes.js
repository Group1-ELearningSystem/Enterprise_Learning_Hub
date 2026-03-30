import express from "express";
import { findSessionByCourseController, createSessionController, removeSessionController, updateSessionController } from "../controllers/sessionController.js";
import { upload } from "../middlewares/upload.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.get("/courses/:courseId/sessions", verifyToken, authorizeRoles("Instructor"), findSessionByCourseController)
router.post("/courses/:courseId/sessions", verifyToken, authorizeRoles("Instructor"), upload.fields([{ name: "video", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), createSessionController)
router.delete("/courses/:courseId/sessions/:sessionId", verifyToken, authorizeRoles("Instructor"), removeSessionController)
router.put("/courses/:courseId/sessions/:sessionId", verifyToken, authorizeRoles("Instructor"), upload.fields([{ name: "video", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), updateSessionController)
export default router
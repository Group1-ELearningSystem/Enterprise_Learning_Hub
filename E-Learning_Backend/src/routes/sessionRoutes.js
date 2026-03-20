import express from "express";
import { findSessionByCourseController, createSessionController, removeSessionController, updateSessionController } from "../controllers/sessionController.js";
import { upload } from "../middlewares/upload.js";
const router = express.Router()

router.get("/courses/:courseId/sessions", findSessionByCourseController)
router.post("/courses/:courseId/sessions", upload.fields([{ name: "video", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), createSessionController)
router.delete("/courses/:courseId/sessions/:sessionId", removeSessionController)
router.put("/courses/:courseId/sessions/:sessionId", upload.fields([{ name: "video", maxCount: 1 }, { name: "pdf", maxCount: 1 }]), updateSessionController)
export default router
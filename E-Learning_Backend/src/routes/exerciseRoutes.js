import express from "express";
import { getAllExercisesController, importExerciseController, removeExerciseController } from "../controllers/exerciseController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.get("/courses/:courseId/sessions/:sessionId/exercises", verifyToken, authorizeRoles("Instructor"), getAllExercisesController)
router.post("/courses/:courseId/sessions/:sessionId/exercises/import", verifyToken, authorizeRoles("Instructor"), importExerciseController)
router.delete("/courses/:courseId/sessions/:sessionId/exercises/:exerciseNo", verifyToken, authorizeRoles("Instructor"), removeExerciseController)

export default router
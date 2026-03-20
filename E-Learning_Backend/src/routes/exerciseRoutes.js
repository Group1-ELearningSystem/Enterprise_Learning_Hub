import express from "express";
import { getAllExercisesController, importExerciseController, removeExerciseController } from "../controllers/exerciseController.js";
const router = express.Router()

router.get("/courses/:courseId/sessions/:sessionId/exercises", getAllExercisesController)
router.post("/courses/:courseId/sessions/:sessionId/exercises/import", importExerciseController)
router.delete("/courses/:courseId/sessions/:sessionId/exercises/:exerciseNo", removeExerciseController)

export default router
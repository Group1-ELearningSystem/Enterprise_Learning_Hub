import express from "express";
import { getCoursesByInstructorsController, createCoureController, updateCoureController, getCourseFeedbackController, searchCourseController, getCourseEarningController } from "../controllers/courseController.js";

const router = express.Router()

router.get("/instructor/:id/courses", getCoursesByInstructorsController)
router.post("/courses", createCoureController)
router.put("/courses/:id", updateCoureController)
router.get("/courses/:courseId/feedbacks", getCourseFeedbackController)
router.get("/courses/search", searchCourseController)
router.get("/courses/:id/earnings", getCourseEarningController)
export default router
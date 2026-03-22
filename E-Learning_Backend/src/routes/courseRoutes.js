import express from "express";
import { getAllCourseController, getCoursesByInstructorsController, createCoureController, updateCoureController, getCourseFeedbackController, searchCourseController, getCourseEarningController, getCourseByIdController } from "../controllers/courseController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.get("/instructor/:id/courses", verifyToken, authorizeRoles("Instructor"), getCoursesByInstructorsController)
router.post("/courses", verifyToken, authorizeRoles("Instructor", "Employee"), createCoureController)
router.put("/courses/:id", verifyToken, authorizeRoles("Instructor", "Employee"), updateCoureController)
router.get("/courses/:courseId/feedbacks", verifyToken, authorizeRoles("Instructor", "Employee"), getCourseFeedbackController)
router.get("/courses/search", verifyToken, searchCourseController)
router.get("/courses/:id/earnings",verifyToken, authorizeRoles("Instructor"), getCourseEarningController)
router.get("/courses/:courseId", getCourseByIdController)
router.get("/courses", verifyToken, authorizeRoles("Employee"), getAllCourseController)
export default router
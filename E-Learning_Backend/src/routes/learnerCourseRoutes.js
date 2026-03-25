import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddlewares.js";
import {
    getLearnerCoursesController,
    getLearnerCourseDetailController,
    registerFreeCourseController,
    getMyCoursesController,
    canLearnCourseController
} from "../controllers/courseLearnerController.js";

const router = express.Router();

/**
 * Public / learner browse courses
 */
router.get("/courses", getLearnerCoursesController);

/**
 * Learner-only routes
 */
router.get(
    "/courses/:courseId",
    verifyToken,
    authorizeRoles("Learner"),
    getLearnerCourseDetailController
);

router.post(
    "/courses/:courseId/register-free",
    verifyToken,
    authorizeRoles("Learner"),
    registerFreeCourseController
);

router.get(
    "/my-courses",
    verifyToken,
    authorizeRoles("Learner"),
    getMyCoursesController
);

router.get(
    "/learning/:courseId",
    verifyToken,
    authorizeRoles("Learner"),
    canLearnCourseController
);

export default router;
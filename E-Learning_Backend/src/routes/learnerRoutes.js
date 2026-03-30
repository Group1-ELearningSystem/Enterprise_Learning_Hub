import { Router } from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddlewares.js";
import * as learnerController from "../controllers/learnerController.js";

const router = Router();

router.use(verifyToken, authorizeRoles("Learner"));

router.get("/profile", learnerController.getProfile);
router.put("/profile", learnerController.updateProfile);
router.put("/change-password", learnerController.changePassword);

router.get("/courses", learnerController.getCourses);
router.get("/courses/:courseId", learnerController.getCourseDetail);
router.post("/courses/:courseId/register-free", learnerController.registerFreeCourse);
router.post("/courses/:courseId/register-paid", learnerController.registerPaidCourse);

router.get("/my-courses", learnerController.getMyCourses);
router.get("/my-progress", learnerController.getMyProgress);

router.get("/learning/:courseId", learnerController.getLearningContent);
router.post("/learning/:courseId/sessions/:sessionId/video-progress", learnerController.saveVideoProgress);
router.post("/learning/:courseId/sessions/:sessionId/mark-complete", learnerController.markSessionComplete);
router.get("/learning/:courseId/sessions/:sessionId/exercises", learnerController.getExercises);
router.post("/learning/:courseId/sessions/:sessionId/exercises/submit", learnerController.submitExercises);

router.post("/financial-requests", learnerController.createFinancialRequest);
router.get("/financial-requests", learnerController.getFinancialRequests);

router.get("/courses/:courseId/feedbacks", learnerController.getCourseFeedbacks);
router.post("/courses/:courseId/feedbacks", learnerController.saveFeedback);
router.post("/courses/:courseId/reaction", learnerController.saveReaction);

router.get("/notifications", learnerController.getNotifications);
router.get("/recommendations", learnerController.getRecommendations);

// demo/manual trigger for cron job logic
router.post("/reminders/run-check", learnerController.runInactiveLearningReminder);

export default router;

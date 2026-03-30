// import {
//     getLearnerCourses,
//     getLearnerCourseDetail,
//     registerFreeCourse,
//     getMyCourses,
//     canLearnCourse
// } from "../services/courseLearnerService.js";

// export async function getLearnerCoursesController(req, res) {
//     try {
//         const result = await getLearnerCourses(req.query);
//         res.json(result);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             message: err.message || "Failed to fetch learner courses"
//         });
//     }
// }

// export async function getLearnerCourseDetailController(req, res) {
//     try {
//         const { courseId } = req.params;
//         const result = await getLearnerCourseDetail(courseId, req.user);
//         res.json(result);
//     } catch (err) {
//         console.error(err);

//         if (err.message === "COURSE_NOT_FOUND") {
//             return res.status(404).json({ message: "Course not found" });
//         }

//         if (err.message === "LEARNER_NOT_FOUND") {
//             return res.status(404).json({ message: "Learner not found" });
//         }

//         if (err.message === "ACCOUNT_NUMBER_MISSING") {
//             return res.status(400).json({ message: "Account number missing in token" });
//         }

//         if (err.message === "FORBIDDEN") {
//             return res.status(403).json({ message: "Learner role required" });
//         }

//         res.status(500).json({
//             message: err.message || "Failed to fetch course detail"
//         });
//     }
// }

// export async function registerFreeCourseController(req, res) {
//     try {
//         const { courseId } = req.params;
//         const result = await registerFreeCourse(courseId, req.user);
//         res.status(201).json(result);
//     } catch (err) {
//         console.error(err);

//         if (err.message === "COURSE_NOT_FOUND") {
//             return res.status(404).json({ message: "Course not found" });
//         }

//         if (err.message === "COURSE_NOT_FREE") {
//             return res.status(400).json({ message: "This course is not free" });
//         }

//         if (err.message === "ALREADY_SUBSCRIBED") {
//             return res.status(400).json({ message: "You already subscribed this course" });
//         }

//         if (err.message === "LEARNER_NOT_FOUND") {
//             return res.status(404).json({ message: "Learner not found" });
//         }

//         if (err.message === "ACCOUNT_NUMBER_MISSING") {
//             return res.status(400).json({ message: "Account number missing in token" });
//         }

//         if (err.message === "FORBIDDEN") {
//             return res.status(403).json({ message: "Learner role required" });
//         }

//         res.status(500).json({
//             message: err.message || "Register free course failed"
//         });
//     }
// }

// export async function getMyCoursesController(req, res) {
//     try {
//         const result = await getMyCourses(req.user);
//         res.json(result);
//     } catch (err) {
//         console.error(err);

//         if (err.message === "LEARNER_NOT_FOUND") {
//             return res.status(404).json({ message: "Learner not found" });
//         }

//         if (err.message === "ACCOUNT_NUMBER_MISSING") {
//             return res.status(400).json({ message: "Account number missing in token" });
//         }

//         if (err.message === "FORBIDDEN") {
//             return res.status(403).json({ message: "Learner role required" });
//         }

//         res.status(500).json({
//             message: err.message || "Failed to fetch my courses"
//         });
//     }
// }

// export async function canLearnCourseController(req, res) {
//     try {
//         const { courseId } = req.params;
//         const result = await canLearnCourse(courseId, req.user);
//         res.json(result);
//     } catch (err) {
//         console.error(err);

//         if (err.message === "COURSE_NOT_FOUND") {
//             return res.status(404).json({ message: "Course not found" });
//         }

//         if (err.message === "COURSE_NOT_ACTIVATED") {
//             return res.status(403).json({ message: "Course is not activated for this learner" });
//         }

//         if (err.message === "LEARNER_NOT_FOUND") {
//             return res.status(404).json({ message: "Learner not found" });
//         }

//         if (err.message === "ACCOUNT_NUMBER_MISSING") {
//             return res.status(400).json({ message: "Account number missing in token" });
//         }

//         if (err.message === "FORBIDDEN") {
//             return res.status(403).json({ message: "Learner role required" });
//         }

//         res.status(500).json({
//             message: err.message || "Failed to validate learning access"
//         });
//     }
// }
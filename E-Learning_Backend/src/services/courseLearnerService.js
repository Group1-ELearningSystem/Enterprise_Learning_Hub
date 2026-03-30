// import { findCourseById } from "../repository/courseRepository.js";
// import {
//     findLearnerByAccountNumber,
//     findSubscriptionByLearnerAndCourse,
//     findSubscriptionStatus,
//     findActiveSubscriptionId,
//     insertSubscription,
//     findCoursesByLearner
// } from "../repository/subscriptionRepository.js";
// import db from "../config/db.js";

// function generateSubscriptionId() {
//     return "SUB" + Math.random().toString(36).substring(2, 10).toUpperCase();
// }

// /**
//  * Resolve learner từ token
//  */
// export async function resolveLearnerFromUser(user) {
//     if (!user) {
//         throw new Error("UNAUTHORIZED");
//     }

//     if (user.role !== "Learner") {
//         throw new Error("FORBIDDEN");
//     }

//     if (user.learnerId) {
//         return {
//             learnerId: user.learnerId,
//             accountNumber: user.accountNumber || null
//         };
//     }

//     if (!user.accountNumber) {
//         throw new Error("ACCOUNT_NUMBER_MISSING");
//     }

//     const learner = await findLearnerByAccountNumber(user.accountNumber);

//     if (!learner) {
//         throw new Error("LEARNER_NOT_FOUND");
//     }

//     return {
//         learnerId: learner.Learner_ID,
//         accountNumber: learner.Account_Number
//     };
// }

// /**
//  * Lấy danh sách course cho learner:
//  * - search theo tên
//  * - filter field
//  * - sort giá
//  * - paging
//  */
// export async function getLearnerCourses(filters = {}) {
//     let {
//         q,
//         field,
//         sort,
//         page = 1,
//         limit = 6
//     } = filters;

//     page = Number(page) || 1;
//     limit = Number(limit) || 6;

//     if (page < 1) page = 1;
//     if (limit < 1) limit = 6;

//     const offset = (page - 1) * limit;

//     const conditions = [];
//     const params = [];

//     conditions.push(`c.Course_Status = 'AVAILABLE'`);
//     if (q) {
//         conditions.push(`c.Course_Name LIKE ?`);
//         params.push(`%${q}%`);
//     }

//     if (field) {
//         conditions.push(`cf.Field_Name = ?`);
//         params.push(field);
//     }

//     let orderBy = `ORDER BY c.Course_ID DESC`;
//     if (sort === "price_asc") {
//         orderBy = `ORDER BY c.Course_Fee ASC`;
//     } else if (sort === "price_desc") {
//         orderBy = `ORDER BY c.Course_Fee DESC`;
//     }

//     const whereClause = conditions.length
//         ? `WHERE ${conditions.join(" AND ")}`
//         : "";

//     const countSql = `
//         SELECT COUNT(DISTINCT c.Course_ID) AS total
//         FROM Courses c
//         LEFT JOIN Courses_Fields cf ON c.Course_ID = cf.Course_ID
//         ${whereClause}
//     `;

//     const dataSql = `
//         SELECT DISTINCT
//             c.Course_ID,
//             c.Course_Name,
//             c.Course_Overview,
//             c.Course_Objective,
//             c.Course_Fee,
//             c.Course_Status,
//             cf.Field_Name
//         FROM Courses c
//         LEFT JOIN Courses_Fields cf ON c.Course_ID = cf.Course_ID
//         ${whereClause}
//         ${orderBy}
//         LIMIT ${limit} OFFSET ${offset}
//     `;

//     const [countRows] = await db.execute(countSql, params);
//     const total = countRows[0]?.total || 0;

//     const [rows] = await db.query(dataSql, params);

//     return {
//         courses: rows.map(c => ({
//             courseId: c.Course_ID,
//             courseName: c.Course_Name,
//             courseOverview: c.Course_Overview,
//             courseObjective: c.Course_Objective,
//             courseFee: Number(c.Course_Fee || 0),
//             courseStatus: c.Course_Status,
//             fieldName: c.Field_Name || null
//         })),
//         total,
//         page,
//         totalPages: Math.ceil(total / limit)
//     };
// }

// /**
//  * Chi tiết course cho learner
//  */
// export async function getLearnerCourseDetail(courseId, user) {
//     const { learnerId } = await resolveLearnerFromUser(user);

//     const course = await findCourseById(courseId);
//     if (!course) {
//         throw new Error("COURSE_NOT_FOUND");
//     }

//     const subscription = await findSubscriptionByLearnerAndCourse(learnerId, courseId);
//     const subscriptionStatus = await findSubscriptionStatus(learnerId, courseId);

//     return {
//         course: {
//             courseId: course.Course_ID,
//             courseName: course.Course_Name,
//             courseOverview: course.Course_Overview,
//             courseObjective: course.Course_Objective,
//             courseFee: Number(course.Course_Fee || 0),
//             courseStatus: course.Course_Status,
//             fieldName: course.Field_Name || null
//         },
//         isSubscribed: !!subscription,
//         subscriptionStatus: subscriptionStatus || null,
//         effectiveFee: Number(course.Course_Fee || 0)
//     };
// }

// /**
//  * Đăng ký khóa học free
//  */
// export async function registerFreeCourse(courseId, user) {
//     const { learnerId } = await resolveLearnerFromUser(user);

//     const course = await findCourseById(courseId);
//     if (!course) {
//         throw new Error("COURSE_NOT_FOUND");
//     }

//     const courseFee = Number(course.Course_Fee || 0);
//     if (courseFee > 0) {
//         throw new Error("COURSE_NOT_FREE");
//     }

//     const existingSubscription = await findSubscriptionByLearnerAndCourse(learnerId, courseId);
//     if (existingSubscription) {
//         throw new Error("ALREADY_SUBSCRIBED");
//     }

//     const subscriptionId = generateSubscriptionId();

//     await insertSubscription({
//         subscriptionId,
//         subscriptionStatus: "Active",
//         learnerId,
//         courseId,
//         paymentProof: null,
//         orderCode: null
//     });

//     return {
//         message: "Register successfully",
//         subscriptionId,
//         subscriptionStatus: "Active"
//     };
// }

// /**
//  * My Courses
//  */
// export async function getMyCourses(user) {
//     const { learnerId } = await resolveLearnerFromUser(user);

//     const rows = await findCoursesByLearner(learnerId);

//     return rows.map(c => ({
//         subscriptionId: c.Subscription_ID,
//         subscriptionStatus: c.Subscription_Status,
//         courseId: c.Course_ID,
//         courseName: c.Course_Name,
//         courseOverview: c.Course_Overview,
//         courseObjective: c.Course_Objective,
//         courseFee: Number(c.Course_Fee || 0),
//         courseStatus: c.Course_Status,
//         fieldName: c.Field_Name || null
//     }));
// }

// /**
//  * Check learner có quyền vào học không
//  * Phase 1 chỉ check active subscription
//  */
// export async function canLearnCourse(courseId, user) {
//     const { learnerId } = await resolveLearnerFromUser(user);

//     const course = await findCourseById(courseId);
//     if (!course) {
//         throw new Error("COURSE_NOT_FOUND");
//     }

//     const subscriptionId = await findActiveSubscriptionId(learnerId, courseId);

//     if (!subscriptionId) {
//         throw new Error("COURSE_NOT_ACTIVATED");
//     }

//     return {
//         message: "Learner can access this course",
//         subscriptionId,
//         course: {
//             courseId: course.Course_ID,
//             courseName: course.Course_Name,
//             courseOverview: course.Course_Overview,
//             courseObjective: course.Course_Objective,
//             courseFee: Number(course.Course_Fee || 0),
//             courseStatus: course.Course_Status
//         }
//     };
// }
import db from "../config/db.js";

/**
 * Tìm learner theo account number
 */
export async function findLearnerByAccountNumber(accountNumber) {
    const sql = `
        SELECT 
            Learner_ID,
            Learner_Full_Name,
            Learner_Email_Address,
            Account_Number
        FROM Learner
        WHERE Account_Number = ?
        LIMIT 1
    `;

    const [rows] = await db.execute(sql, [accountNumber]);
    return rows[0] || null;
}

/**
 * Lấy subscription theo learner + course
 */
export async function findSubscriptionByLearnerAndCourse(learnerId, courseId) {
    const sql = `
        SELECT 
            Subscription_ID,
            Subscription_Status,
            Learner_ID,
            Course_ID,
            Payment_Proof
        FROM Subscription
        WHERE Learner_ID = ?
          AND Course_ID = ?
        LIMIT 1
    `;

    const [rows] = await db.execute(sql, [learnerId, courseId]);
    return rows[0] || null;
}

/**
 * Lấy status subscription theo learner + course
 */
export async function findSubscriptionStatus(learnerId, courseId) {
    const sql = `
        SELECT Subscription_Status
        FROM Subscription
        WHERE Learner_ID = ?
          AND Course_ID = ?
        LIMIT 1
    `;

    const [rows] = await db.execute(sql, [learnerId, courseId]);
    return rows[0]?.Subscription_Status || null;
}

/**
 * Lấy subscription active id để cho phép learner vào học
 */
export async function findActiveSubscriptionId(learnerId, courseId) {
    const sql = `
        SELECT Subscription_ID
        FROM Subscription
        WHERE Learner_ID = ?
          AND Course_ID = ?
          AND Subscription_Status = 'Active'
        LIMIT 1
    `;

    const [rows] = await db.execute(sql, [learnerId, courseId]);
    return rows[0]?.Subscription_ID || null;
}

/**
 * Tạo subscription mới
 */
export async function insertSubscription(subscription) {
    const sql = `
        INSERT INTO Subscription
        (
            Subscription_ID,
            Subscription_Status,
            Learner_ID,
            Course_ID,
            Payment_Proof
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
        subscription.subscriptionId,
        subscription.subscriptionStatus,
        subscription.learnerId,
        subscription.courseId,
        subscription.paymentProof ?? null
    ]);

    return result;
}

/**
 * Lấy danh sách khóa học learner đã đăng ký
 */
export async function findCoursesByLearner(learnerId) {
    const sql = `
        SELECT
            c.Course_ID,
            c.Course_Name,
            c.Course_Overview,
            c.Course_Objective,
            c.Course_Fee,
            c.Course_Status,
            cf.Field_Name,
            s.Subscription_ID,
            s.Subscription_Status
        FROM Subscription s
        INNER JOIN Courses c ON s.Course_ID = c.Course_ID
        LEFT JOIN Courses_Fields cf ON c.Course_ID = cf.Course_ID
        WHERE s.Learner_ID = ?
        ORDER BY s.Subscription_ID DESC
    `;

    const [rows] = await db.execute(sql, [learnerId]);
    return rows;
}
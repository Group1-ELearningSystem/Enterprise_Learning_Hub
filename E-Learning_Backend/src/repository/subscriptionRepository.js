import db from "../config/db.js";

export const findActiveSubscription = async (learnerId, courseId) => {
  const [rows] = await db.query(
    `SELECT * FROM Subscription
     WHERE Learner_ID = ? AND Course_ID = ? AND Subscription_Status = 'Active'
     ORDER BY Subscription_ID DESC
     LIMIT 1`,
    [learnerId, courseId]
  );
  return rows[0] || null;
};

export const findAnySubscription = async (learnerId, courseId) => {
  const [rows] = await db.query(
    `SELECT * FROM Subscription
     WHERE Learner_ID = ? AND Course_ID = ?
     ORDER BY Subscription_ID DESC
     LIMIT 1`,
    [learnerId, courseId]
  );
  return rows[0] || null;
};

export const createSubscription = async ({
  subscriptionId,
  status,
  learnerId,
  courseId,
  paymentProof = null
}) => {
  await db.query(
    `INSERT INTO Subscription
     (Subscription_ID, Subscription_Status, Learner_ID, Course_ID, Payment_Proof, Order_Code, Subscription_Date)
     VALUES (?, ?, ?, ?, ?, NULL, CURDATE())`,
    [subscriptionId, status, learnerId, courseId, paymentProof]
  );
};

export const findMyCoursesByAccountNumber = async (accountNumber) => {
  const [rows] = await db.query(
    `SELECT c.Course_ID, c.Course_Name, c.Course_Overview, c.Course_Fee,
            s.Subscription_ID, s.Subscription_Status, s.Subscription_Date,
            cf.Field_Name,
            i.Instructor_Full_Name
     FROM Subscription s
     JOIN Learner l ON l.Learner_ID = s.Learner_ID
     JOIN Courses c ON c.Course_ID = s.Course_ID
     LEFT JOIN Courses_Fields cf ON cf.Course_ID = c.Course_ID
     LEFT JOIN Instructor_Courses ic ON ic.Course_ID = c.Course_ID
     LEFT JOIN Instructor i ON i.Instructor_ID = ic.Instructor_ID
     WHERE l.Account_Number = ?
     ORDER BY s.Subscription_ID DESC`,
    [accountNumber]
  );
  return rows;
};

export const findEnrolledCourseIds = async (learnerId) => {
  const [rows] = await db.query(
    `SELECT DISTINCT Course_ID FROM Subscription WHERE Learner_ID = ?`,
    [learnerId]
  );
  return rows;
};
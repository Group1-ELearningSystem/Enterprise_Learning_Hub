import db from "../config/db.js";

export const findApprovedFinancialSupport = async (learnerId, courseId) => {
  const [rows] = await db.query(
    `SELECT * FROM Financial_Request
     WHERE Learner_ID = ? AND Course_ID = ? AND Request_Status IN ('PROCESSED', 'Approved')
     ORDER BY Request_Date DESC
     LIMIT 1`,
    [learnerId, courseId]
  );
  return rows[0] || null;
};

export const findPendingFinancialRequest = async (learnerId, courseId) => {
  const [rows] = await db.query(
    `SELECT * FROM Financial_Request
     WHERE Learner_ID = ? AND Course_ID = ? AND Request_Status IN ('Pending', 'PROCESSING')
     ORDER BY Request_Date DESC
     LIMIT 1`,
    [learnerId, courseId]
  );
  return rows[0] || null;
};

export const createFinancialRequestRecord = async ({
  requestId,
  requestAmount,
  proof,
  reason,
  educationalBackground,
  employmentStatus,
  learnerId,
  courseId
}) => {
  await db.query(
    `INSERT INTO Financial_Request (
      Request_ID, Request_Amount, Request_Date, Request_Proof, Request_Status,
      Request_Reason, Request_Educational_Background, Request_Employment_Status,
      Learner_ID, Course_ID
    ) VALUES (?, ?, CURDATE(), ?, 'Pending', ?, ?, ?, ?, ?)`,
    [requestId, requestAmount, proof || null, reason || null, educationalBackground || null, employmentStatus || null, learnerId, courseId]
  );
};

export const findFinancialRequestsByLearner = async (learnerId) => {
  const [rows] = await db.query(
    `SELECT fr.*, c.Course_Name
     FROM Financial_Request fr
     JOIN Courses c ON c.Course_ID = fr.Course_ID
     WHERE fr.Learner_ID = ?
     ORDER BY fr.Request_Date DESC, fr.Request_ID DESC`,
    [learnerId]
  );
  return rows;
};
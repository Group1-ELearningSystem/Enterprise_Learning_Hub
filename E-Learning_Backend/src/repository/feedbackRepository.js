import db from "../config/db.js";
import { generateCode } from "../utils/id.js";

export const findCourseFeedbacks = async (courseId) => {
  const [rows] = await db.query(
    `SELECT f.Feedback_ID, f.Feedback_Comment, f.Feedback_Rating, f.Feedback_Created_At,
            l.Learner_ID, l.Learner_Full_Name
     FROM Feedbacks f
     LEFT JOIN Learner l ON l.Learner_ID = f.Learner_ID
     WHERE f.Course_ID = ?
     ORDER BY f.Feedback_Created_At DESC, f.Feedback_ID DESC`,
    [courseId]
  );
  return rows;
};

export const findFeedbackSummary = async (courseId) => {
  const [[summary]] = await db.query(
    `SELECT ROUND(AVG(Feedback_Rating), 2) AS avgRating, COUNT(*) AS totalFeedbacks
     FROM Feedbacks WHERE Course_ID = ?`,
    [courseId]
  );

  const [[reactions]] = await db.query(
    `SELECT
        SUM(CASE WHEN reaction_type = 'LIKE' THEN 1 ELSE 0 END) AS totalLikes,
        SUM(CASE WHEN reaction_type = 'DISLIKE' THEN 1 ELSE 0 END) AS totalDislikes
     FROM Course_Reactions WHERE Course_ID = ?`,
    [courseId]
  );

  return {
    avgRating: Number(summary?.avgRating || 0),
    totalFeedbacks: Number(summary?.totalFeedbacks || 0),
    totalLikes: Number(reactions?.totalLikes || 0),
    totalDislikes: Number(reactions?.totalDislikes || 0)
  };
};

export const findLearnerFeedback = async (courseId, learnerId) => {
  const [rows] = await db.query(
    `SELECT Feedback_ID FROM Feedbacks WHERE Course_ID = ? AND Learner_ID = ? LIMIT 1`,
    [courseId, learnerId]
  );
  return rows[0] || null;
};

export const updateFeedback = async (feedbackId, comment, rating) => {
  await db.query(
    `UPDATE Feedbacks
     SET Feedback_Comment = ?, Feedback_Rating = ?, Feedback_Created_At = NOW()
     WHERE Feedback_ID = ?`,
    [comment, rating, feedbackId]
  );
};

export const createFeedback = async (courseId, learnerId, comment, rating) => {
  await db.query(
    `INSERT INTO Feedbacks (Course_ID, Learner_ID, Feedback_Comment, Feedback_Rating, Feedback_Created_At)
     VALUES (?, ?, ?, ?, NOW())`,
    [courseId, learnerId, comment, rating]
  );
};

export const findLatestFeedbackId = async (courseId, learnerId) => {
  const [[row]] = await db.query(
    `SELECT Feedback_ID
     FROM Feedbacks
     WHERE Course_ID = ? AND Learner_ID = ?
     ORDER BY Feedback_ID DESC
     LIMIT 1`,
    [courseId, learnerId]
  );
  return row?.Feedback_ID || null;
};

export const upsertCourseReaction = async (courseId, learnerId, reactionType) => {
  await db.query(
    `INSERT INTO Course_Reactions
     (Reaction_ID, Course_ID, Learner_ID, reaction_type, created_at, updated_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())
     ON DUPLICATE KEY UPDATE reaction_type = VALUES(reaction_type), updated_at = NOW()`,
    [generateCode("REA", 10), courseId, learnerId, reactionType]
  );
};
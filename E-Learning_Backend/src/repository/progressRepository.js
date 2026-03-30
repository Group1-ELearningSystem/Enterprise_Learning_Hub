import db from "../config/db.js";
import { generateCode } from "../utils/id.js";

export const findMyProgress = async (learnerId) => {
  const [rows] = await db.query(
    `SELECT c.Course_ID,
            c.Course_Name,
            COUNT(DISTINCT s2.Session_ID) AS totalSessions,
            COUNT(DISTINCT CASE WHEN p.Progress_Status = 'Completed' THEN p.Session_ID END) AS completedSessions,
            DATE_FORMAT(MAX(p.Progress_Date), '%d/%m/%Y %H:%i') AS lastUpdated
     FROM Subscription s
     JOIN Courses c ON c.Course_ID = s.Course_ID
     LEFT JOIN Sessions s2 ON s2.Course_ID = c.Course_ID
     LEFT JOIN Progress p ON p.Subscription_ID = s.Subscription_ID AND p.Session_ID = s2.Session_ID AND p.Course_ID = c.Course_ID
     WHERE s.Learner_ID = ? AND s.Subscription_Status = 'Active'
     GROUP BY c.Course_ID, c.Course_Name
     ORDER BY c.Course_Name ASC`,
    [learnerId]
  );
  return rows;
};

export const findProgressBySubscriptionCourseSession = async (subscriptionId, courseId, sessionId) => {
  const [rows] = await db.query(
    `SELECT Progress_ID
     FROM Progress
     WHERE Subscription_ID = ? AND Course_ID = ? AND Session_ID = ?
     LIMIT 1`,
    [subscriptionId, courseId, sessionId]
  );
  return rows[0] || null;
};

export const upsertProgress = async (subscriptionId, courseId, sessionId, status) => {
  const existing = await findProgressBySubscriptionCourseSession(subscriptionId, courseId, sessionId);

  if (existing) {
    await db.query(
      `UPDATE Progress SET Progress_Status = ?, Progress_Date = NOW()
       WHERE Progress_ID = ?`,
      [status, existing.Progress_ID]
    );
    return existing.Progress_ID;
  }

  const progressId = generateCode("PRO", 12);
  await db.query(
    `INSERT INTO Progress
     (Progress_ID, Progress_Status, Subscription_ID, Session_ID, Course_ID, Progress_Date)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [progressId, status, subscriptionId, sessionId, courseId]
  );
  return progressId;
};

export const findCompletedCourseIds = async (learnerId) => {
  const [rows] = await db.query(
    `SELECT DISTINCT p.Course_ID
     FROM Progress p
     JOIN Subscription s ON s.Subscription_ID = p.Subscription_ID
     WHERE s.Learner_ID = ? AND p.Progress_Status = 'Completed'`,
    [learnerId]
  );
  return rows;
};

export const findInactiveLearners = async () => {
  const [rows] = await db.query(
    `SELECT l.Learner_ID, l.Learner_Full_Name, l.Learner_Email_Address,
            MAX(p.Progress_Date) AS lastLearningAt
     FROM Learner l
     JOIN Subscription s ON s.Learner_ID = l.Learner_ID AND s.Subscription_Status = 'Active'
     LEFT JOIN Progress p ON p.Subscription_ID = s.Subscription_ID
     GROUP BY l.Learner_ID, l.Learner_Full_Name, l.Learner_Email_Address
     HAVING lastLearningAt IS NULL OR lastLearningAt < DATE_SUB(NOW(), INTERVAL 7 DAY)`
  );
  return rows;
};
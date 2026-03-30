import db from "../config/db.js";
import { generateCode } from "../utils/id.js";

export const findNotificationsByLearner = async (learnerId) => {
  const [rows] = await db.query(
    `SELECT Notification_ID, notification_type, title, message, is_read, created_at
     FROM Notifications
     WHERE Learner_ID = ?
     ORDER BY created_at DESC, Notification_ID DESC`,
    [learnerId]
  );
  return rows;
};

export const createNotification = async ({ learnerId, type, title, message }) => {
  await db.query(
    `INSERT INTO Notifications
     (Notification_ID, Learner_ID, notification_type, title, message, is_read, created_at)
     VALUES (?, ?, ?, ?, ?, 0, NOW())`,
    [generateCode("NOT", 10), learnerId, type, title, message]
  );
};
import db from "../config/db.js";
import { generateCode } from "../utils/id.js";

export const saveVideoTracking = async ({
  subscriptionId,
  courseId,
  sessionId,
  watchedSeconds,
  lastPositionSeconds,
  videoDurationSeconds
}) => {
  await db.query(
    `INSERT INTO Video_Tracking
     (Tracking_ID, Subscription_ID, Course_ID, Session_ID, watched_seconds, last_position_seconds, video_duration_seconds, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
       watched_seconds = VALUES(watched_seconds),
       last_position_seconds = VALUES(last_position_seconds),
       video_duration_seconds = VALUES(video_duration_seconds),
       updated_at = NOW()`,
    [
      generateCode("VTR", 10),
      subscriptionId,
      courseId,
      sessionId,
      watchedSeconds,
      lastPositionSeconds,
      videoDurationSeconds
    ]
  );
};
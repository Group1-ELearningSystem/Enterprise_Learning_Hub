import db from "../config/db.js";

export const findCourseById = async (courseId) => {
  const [rows] = await db.query(
    `SELECT c.Course_ID, c.Course_Name, c.Course_Overview, c.Course_Objective, c.Course_Fee, c.Course_Status,
            cf.Field_Name,
            i.Instructor_ID,
            i.Instructor_Full_Name,
            ROUND(AVG(f.Feedback_Rating), 2) AS avgRating,
            COUNT(DISTINCT f.Feedback_ID) AS totalFeedbacks
     FROM Courses c
     LEFT JOIN Courses_Fields cf ON cf.Course_ID = c.Course_ID
     LEFT JOIN Instructor_Courses ic ON ic.Course_ID = c.Course_ID
     LEFT JOIN Instructor i ON i.Instructor_ID = ic.Instructor_ID
     LEFT JOIN Feedbacks f ON f.Course_ID = c.Course_ID
     WHERE c.Course_ID = ?
     GROUP BY c.Course_ID, c.Course_Name, c.Course_Overview, c.Course_Objective, c.Course_Fee, c.Course_Status,
              cf.Field_Name, i.Instructor_ID, i.Instructor_Full_Name
     LIMIT 1`,
    [courseId]
  );
  return rows[0] || null;
};

export const findCourses = async ({ keyword, field, instructor, status = "AVAILABLE", learnerId }) => {
  const filters = [];
  const values = [];

  if (status) {
    filters.push(`c.Course_Status = ?`);
    values.push(status);
  }
  if (keyword) {
    filters.push(`c.Course_Name LIKE ?`);
    values.push(`%${keyword}%`);
  }
  if (field) {
    filters.push(`cf.Field_Name LIKE ?`);
    values.push(`%${field}%`);
  }
  if (instructor) {
    filters.push(`i.Instructor_Full_Name LIKE ?`);
    values.push(`%${instructor}%`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await db.query(
    `SELECT c.Course_ID, c.Course_Name, c.Course_Overview, c.Course_Objective, c.Course_Fee, c.Course_Status,
            cf.Field_Name,
            i.Instructor_ID,
            i.Instructor_Full_Name,
            ROUND(AVG(f.Feedback_Rating), 2) AS avgRating,
            COUNT(DISTINCT f.Feedback_ID) AS totalFeedbacks,
            MAX(CASE WHEN s.Learner_ID = ? THEN s.Subscription_Status END) AS learnerSubscriptionStatus
     FROM Courses c
     LEFT JOIN Courses_Fields cf ON cf.Course_ID = c.Course_ID
     LEFT JOIN Instructor_Courses ic ON ic.Course_ID = c.Course_ID
     LEFT JOIN Instructor i ON i.Instructor_ID = ic.Instructor_ID
     LEFT JOIN Feedbacks f ON f.Course_ID = c.Course_ID
     LEFT JOIN Subscription s ON s.Course_ID = c.Course_ID AND s.Learner_ID = ?
     ${whereClause}
     GROUP BY c.Course_ID, c.Course_Name, c.Course_Overview, c.Course_Objective, c.Course_Fee, c.Course_Status,
              cf.Field_Name, i.Instructor_ID, i.Instructor_Full_Name
     ORDER BY c.Course_Name ASC`,
    [learnerId || null, learnerId || null, ...values]
  );

  return rows;
};

export const findLearningSessionsByCourse = async (subscriptionId, courseId) => {
  const [rows] = await db.query(
    `SELECT s.Session_ID, s.Course_ID, s.Session_Title, s.Session_Video, s.Session_Document,
            p.Progress_Status, p.Progress_Date,
            COALESCE(vt.watched_seconds, 0) AS watchedSeconds,
            COALESCE(vt.video_duration_seconds, 0) AS videoDurationSeconds,
            COALESCE(vt.last_position_seconds, 0) AS lastPositionSeconds
     FROM Sessions s
     LEFT JOIN Progress p ON p.Session_ID = s.Session_ID AND p.Course_ID = s.Course_ID AND p.Subscription_ID = ?
     LEFT JOIN Video_Tracking vt ON vt.Subscription_ID = ? AND vt.Course_ID = s.Course_ID AND vt.Session_ID = s.Session_ID
     WHERE s.Course_ID = ?
     ORDER BY s.Session_ID ASC`,
    [subscriptionId, subscriptionId, courseId]
  );
  return rows;
};

export const findExercisesBySession = async (courseId, sessionId, withAnswer = false) => {
  const sql = withAnswer
    ? `SELECT Exercise_Number, Exercise_Question, Exercise_Answer
       FROM Sessions_Exercise
       WHERE Course_ID = ? AND Session_ID = ?
       ORDER BY Exercise_Number ASC`
    : `SELECT Exercise_Number, Exercise_Question, Option_A, Option_B, Option_C, Option_D
       FROM Sessions_Exercise
       WHERE Course_ID = ? AND Session_ID = ?
       ORDER BY Exercise_Number ASC`;

  const [rows] = await db.query(sql, [courseId, sessionId]);
  return rows;
};

export const findAllAvailableCoursesForRecommendation = async () => {
  const [rows] = await db.query(
    `SELECT c.Course_ID, c.Course_Name, c.Course_Overview, c.Course_Fee, c.Course_Status,
            cf.Field_Name,
            ROUND(AVG(f.Feedback_Rating), 2) AS avgRating
     FROM Courses c
     LEFT JOIN Courses_Fields cf ON cf.Course_ID = c.Course_ID
     LEFT JOIN Feedbacks f ON f.Course_ID = c.Course_ID
     WHERE c.Course_Status = 'AVAILABLE'
     GROUP BY c.Course_ID, c.Course_Name, c.Course_Overview, c.Course_Fee, c.Course_Status, cf.Field_Name`
  );
  return rows;
};
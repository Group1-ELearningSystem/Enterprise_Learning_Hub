import db from "../config/db.js";

function generateCourseId() {
    const random = Math.floor(Math.random() * 900 + 100)
    return "CRS" + random
}

export async function findFeedbacksByCourse(courseId, limit, offset){
    const query = 
    `
        SELECT f.Feedback_ID, f.Feedback_Comment, f.Feedback_Rating, f.Feedback_Created_At, l.Learner_ID, l.Learner_Full_Name
        FROM Feedbacks f
        JOIN Learner l ON f.Learner_ID = l.Learner_ID
        WHERE f.Course_ID = ?
        ORDER BY f.Feedback_Created_At DESC
        LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `
    const [rows] = await db.execute(query, [courseId])
    return rows
}

export async function findCoursesByInstructor(instructorId) {
    const query =
        `
        SELECT c.Course_ID, c.Course_Name, c.Course_Overview, c.Course_Objective, c.Course_Fee, c.Course_Status,
               ROUND(AVG(f.Feedback_Rating), 1) AS avg_rating,
               COUNT(f.Feedback_Rating) AS total_reviews
        FROM Courses c
        JOIN Instructor_Courses ic ON c.Course_ID = ic.Course_ID
        LEFT JOIN Feedbacks f ON c.Course_ID = f.Course_ID
        WHERE ic.Instructor_ID = ?
        GROUP BY c.Course_ID
    `
    const [rows] = await db.execute(query, [instructorId])
    return rows
}

export async function findCourseEarning(courseId) {
    const query = 
    `
        SELECT c.Course_ID, c.Course_Fee, 
               COUNT(s.Subscription_ID) AS total_subscribers,
               (COUNT(s.Subscription_ID) * c.Course_Fee) AS total_earned
        FROM Courses c
        LEFT JOIN Subscription s ON c.Course_ID = s.Course_ID AND s.Subscription_Status = 'Active'
        WHERE c.Course_ID = ?
        GROUP BY c.Course_ID
    `    
    const [rows] = await db.execute(query, [courseId]);
    return rows[0];
}

export async function searchCoursesByTitle(keyword) {
    const query = 
    `
        SELECT Course_ID, Course_Name, Course_Overview
        FROM Courses
        WHERE Course_Name LIKE ? OR SOUNDEX(Course_Name) = SOUNDEX(?)
        LIMIT 10
    `
    const searchPattern = `%${keyword}%`
    const [rows] = await db.execute(query, [searchPattern,keyword])
    return rows
}

export async function insertCourseWithInstructor(course, instructorId) {
    const connection = db.getConnection()

    try {
        await connection.beginTransaction

        const courseId = generateCourseId()
        const insertCourseQuery =
        `
            INSERT INTO Courses
            (Course_ID, Course_Name, Course_Overview, Course_Objective, Course_Fee, Course_Status)
            VALUES (?,?,?,?,?,?)
        `

        await db.execute(insertCourseQuery, [
            courseId,
            course.courseName,
            course.overview,
            course.objective,
            course.fee,
            course.status
        ])

        const instructorQuery =
        `
            INSERT INTO Instructor_Courses
            (Instructor_ID, Course_ID)
            VALUES (?,?)
        `

        await db.execute(instructorQuery, [
            instructorId,
            courseId
        ])

        await connection.commit
        return courseId
    } catch(err) {
        await connection.rollback
        throw err
    } finally {
        await connection.release
    }
}

export async function updateCourseInformation(course, courseId) {
    const query = 
    `
        UPDATE Courses
        SET Course_Name = ?, Course_Overview = ?, Course_Objective = ?, Course_Fee = ?, Course_Status = ?
        WHERE Course_ID = ?
    `

    await db.execute(query, [
        course.courseName,
        course.overview,
        course.objective,
        course.fee,
        course.status,
        courseId
    ])
}
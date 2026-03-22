import db from "../config/db.js"

export async function searchInstructors(keyword) {
    const query =
    `
        SELECT Instructor_ID, Instructor_Full_Name, Instructor_Email_Address, Instructor_Phone_Number
        FROM Instructor
        WHERE Instructor_ID LIKE ? OR Instructor_Full_Name LIKE ? OR Instructor_Email_Address LIKE ? OR Instructor_Phone_Number LIKE ?
        LIMIT 10
    `
    const searchTerm = `%${keyword}%`
    const [rows] = await db.execute(
        query,
        [
            searchTerm,
            searchTerm,
            searchTerm,
            searchTerm
        ]
    )
    return rows
}
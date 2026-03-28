import db from "../config/db.js";

export async function getAllRequests(search, status, date) {
    let query = 
    `
        SELECT fr.Request_ID, fr.Request_Date, fr.Request_Status, fr.Request_Amount,
            l.Learner_Full_Name,
            c.Course_Name
        FROM Financial_Request fr
        JOIN Learner l ON fr.Learner_ID = l.Learner_ID
        JOIN Courses c ON fr.Course_ID = c.Course_ID
        WHERE 1=1
    `
    const params = []
    if (search) {
        query += `AND (l.Learner_Full_Name LIKE ? OR c.Course_Name LIKE ?)`
        params.push(
            `%${search}%`,
            `%${search}%`
        )
    }

    if (status) {
        query += `AND fr.Request_Status = ?`
        params.push(status)
    }

    if (date) {
        query += `AND fr.Request_Date = ?`
        params.push(date)
    }

    query += `ORDER BY fr.Request_Date DESC`

    const [rows] = await db.query(query, params);
    return rows;
}

export async function getRequestById(id) {
    const query = 
    `
        SELECT fr.Request_ID, fr.Request_Date, fr.Request_Proof, fr.Request_Status, fr.Request_Amount, fr.Request_Reason, fr.Request_Educational_Background, fr.Request_Employment_Status,
               l.Learner_Full_Name,
               c.Course_Name, c.Course_Fee
        FROM Financial_Request fr
        JOIN Learner l  ON fr.Learner_ID = l.Learner_ID
        JOIN Courses c ON fr.Course_ID = c.Course_ID
        WHERE fr.Request_ID = ?
    `
    const [rows] = await db.query(query, [id]);
    return rows[0];
}

export async function updateRequests(id, status) {
    const query = 
    `
        UPDATE Financial_Request
        SET Request_Status = ?
        WHERE Request_ID = ?
    `
    await db.query(query,[status, id])

}
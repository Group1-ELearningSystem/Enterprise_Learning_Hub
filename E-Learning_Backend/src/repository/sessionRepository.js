import db from "../config/db.js"

export async function findSession(courseId, sessionId){
    const query = `
        SELECT Session_Video, Session_Document
        FROM Sessions
        WHERE Session_ID = ? AND Course_ID = ?
    `
    const [rows] = await db.execute(query,[sessionId, courseId])
    return rows[0]
}

export async function getSessionByCourse(courseId) {
    const query = 
    `
        SELECT Session_ID, Session_Title, Session_Video, Session_Document, Course_ID
        FROM Sessions
        WHERE Course_ID = ?
        ORDER BY Session_ID
    `
    const [rows] = await db.execute(query, [courseId])
    return rows;
}

export async function insertSession(session) {
    const query = 
    `
        INSERT INTO Sessions (Session_ID, Session_Title, Session_Video, Session_Document, Course_ID)
        VALUES (?,?,?,?,?)
    `
    await db.execute(query,[
        session.sessionId,
        session.sessionTitle,
        session.sessionVideo,
        session.sessionDocument,
        session.courseId
    ])
}

export async function findLastSessionIdByCourse(courseId) {
    const query = `
        SELECT Session_ID
        FROM Sessions
        WHERE Course_ID = ?
        ORDER BY Session_ID DESC
        LIMIT 1
    `
    const [rows] = await db.execute(query,[courseId])
    return rows[0]?.Session_ID || null
}

export async function deleteSession(courseId, sessionId) {
    const connection = await db.getConnection

    try {
        await connection.beginTransaction

        await db.execute(`
            DELETE FROM Sessions_Exercise
            WHERE Session_ID = ?
            AND Course_ID = ?
        `, [sessionId, courseId])

        await db.execute(`
            DELETE FROM Sessions
            WHERE Session_ID = ?
            AND Course_ID = ?
        `, [sessionId, courseId])
        await connection.commit()
    } catch (err) {
        await connection.rollback()
        throw err
    } finally {
        connection.release()
    }
}

export async function updateSession(session, sessionId, courseId) {
    const query = 
    `
        UPDATE Sessions
        SET Session_Title = ?, Session_Video = ?, Session_Document = ?
        WHERE Session_ID = ?
        AND Course_ID = ?
    `   
    await db.execute(query,[
        session.sessionTitle ?? null,
        session.sessionVideo ?? null,
        session.sessionDocument ?? null,
        sessionId,
        courseId
    ])
}
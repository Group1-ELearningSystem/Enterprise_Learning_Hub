import db from "../config/db.js";

export async function findLastExerciseNumber(courseId, sessionId){
    const query = 
    `
        SELECT Exercise_Number
        FROM Sessions_Exercise
        WHERE Course_ID = ?
        AND Session_ID = ?
        ORDER BY Exercise_Number DESC
        LIMIT 1
    `
    const [rows] = await db.execute(query,[courseId, sessionId])
    return rows[0]?.Exercise_Number || null
}

export async function findExercises(courseId, sessionId) {
    const query = 
    `
        SELECT Exercise_Number, Exercise_Question, Exercise_Answer, Option_A, Option_B, Option_C, Option_D, Course_ID, Session_ID
        FROM Sessions_Exercise
        WHERE Course_ID = ?
        AND Session_ID = ?
        ORDER BY Exercise_Number
    `
    const [rows] = await db.execute(query,[courseId, sessionId])
    return rows
}

export async function insertExercises(exercise) {
    const query = 
    `
        INSERT INTO Sessions_Exercise (Exercise_Number, Exercise_Question, Exercise_Answer, Session_ID, Course_ID, Option_A, Option_B, Option_C, Option_D)
        VALUES (?,?,?,?,?,?,?,?,?)
    `
    await db.execute(query,[
        exercise.exerciseNumber,
        exercise.question,
        exercise.answer,
        exercise.sessionId,
        exercise.courseId,
        exercise.optionA,
        exercise.optionB,
        exercise.optionC,
        exercise.optionD
    ])
}

export async function deleteExercise(courseId, sessionId, exerciseNo) {
    const query = `
        DELETE FROM Sessions_Exercise
        WHERE Course_ID = ?
        AND Session_ID = ?
        AND Exercise_Number = ?
    `
    await db.execute(query,[courseId, sessionId, exerciseNo])
}

export async function deleteExercisesBySession(courseId, sessionId){
    const query = `
        DELETE FROM Sessions_Exercise
        WHERE Course_ID = ?
        AND Session_ID = ?
    `
    await db.execute(query,[courseId, sessionId])
}
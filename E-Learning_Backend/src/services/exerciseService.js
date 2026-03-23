import { findExercises, insertExercises, findLastExerciseNumber, deleteExercisesBySession, deleteExercise } from "../repository/exerciseRepository.js";

function generateNextExerciseNumber(lastNumber){
    if(!lastNumber){
        return "EX001"
    }
    const number = parseInt(lastNumber.replace("EX",""))
    const next = number + 1
    return "EX" + String(next).padStart(3,"0")
}

export async function getAllExercises(courseId, sessionId) {
    const exercises = await findExercises(courseId, sessionId)
    return exercises
}

export async function importExercises(courseId, sessionId, exercises) {
    await deleteExercisesBySession(courseId, sessionId)

    let lastNumber = await findLastExerciseNumber(courseId, sessionId)

    for(const ex of exercises){
        const exerciseNumber = generateNextExerciseNumber(lastNumber)
        const exercise = {
            exerciseNumber: exerciseNumber,
            question: ex.question,
            answer: ex.answer,
            optionA: ex.optionA,
            optionB: ex.optionB,
            optionC: ex.optionC,
            optionD: ex.optionD,
            courseId,
            sessionId
        }
        await insertExercises(exercise)
        lastNumber = exerciseNumber
    }
}

export async function removeExercise(courseId, sessionId, exerciseNo) {
    await deleteExercise(courseId, sessionId, exerciseNo)
}
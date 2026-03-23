import { getAllExercises, importExercises, removeExercise } from "../services/exerciseService.js"

export async function getAllExercisesController(req, res) {
    try{
        const {courseId, sessionId} = req.params
        const exercise = await getAllExercises(courseId, sessionId)
        res.json(exercise)
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Failed to fetch exercises"})
    }
}

export async function importExerciseController(req, res) {
    try{
        const {courseId, sessionId} = req.params
        const exercises = req.body.exercise

        await importExercises(courseId, sessionId, exercises)
        res.json({message:"Exercises imported successfully"})
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Import failed"})
    } 
}

export async function removeExerciseController(req, res){
    try{
        const {courseId, sessionId, exerciseNo} = req.params
        await removeExercise(courseId, sessionId, exerciseNo)
        res.json({message:"Exercise deleted successfully"})
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Failed to delete exercise"})
    }
}
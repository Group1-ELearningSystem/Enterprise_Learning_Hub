import { findSessionByCourse, createSession, removeSession, updateSessionService } from "../services/sessionService.js";

export async function findSessionByCourseController(req, res) {
    try{
        const courseId = req.params.courseId
        const session = await findSessionByCourse(courseId)
        res.json(session)
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Failed to fetch sessions"})
    }
}

export async function createSessionController(req, res) {
    try{
        const courseId = req.params.courseId
        const title = req.body.title
        const videoPath = req.files.video[0].path
        const pdfPath = req.files.pdf[0].path

        await createSession({
            title,
            videoPath,
            pdfPath,
            courseId
        })

        res.json({message:"Session created"})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Failed to create session"})
    }
}

export async function removeSessionController(req, res) {
    try{
        const {courseId, sessionId} = req.params
        await removeSession(courseId, sessionId)
        res.json({message:"Session deleted !!!"})
    }catch(err){
        console.error(err)
        res.status(500).json({message:"Failed to delete session"})
    }
    
}

export async function updateSessionController(req, res) {
    try{
        const courseId = req.params.courseId
        const sessionId = req.params.sessionId
        const title = req.body.title
        const videoPath = req.files?.video?.[0]?.path
        const pdfPath = req.files?.pdf?.[0]?.path

        await updateSessionService({
            courseId,
            sessionId,
            title,
            videoPath,
            pdfPath
        })
        res.json({ message: "Session updated successfully" })
    } catch(err){
        console.error(err)
        res.status(500).json({message:"Update failed"})
    }
}
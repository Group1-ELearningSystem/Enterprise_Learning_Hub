import { getSessionByCourse, insertSession, findLastSessionIdByCourse, deleteSession, findSession, updateSession } from "../repository/sessionRepository.js";
import fs from "fs/promises"
import path from "path"

function generateNextSessionId(lastId) {
    if (!lastId) {
        return "SES001"
    }
    const number = parseInt(lastId.substring(3)) + 1
    return "SES" + number.toString().padStart(3, "0")
}

export async function findSessionByCourse(courseId) {
    const sessions = await getSessionByCourse(courseId) || []

    return sessions.map(s => ({
        sessionId: s.Session_ID,
        sessionTitle: s.Session_Title,
        sessionVideo: s.Session_Video,
        sessionDocument: s.Session_Document,
        courseId: s.Course_ID
    }))
}

export async function createSession(data) {
    const lastId = await findLastSessionIdByCourse(data.courseId)
    const sessionId = generateNextSessionId(lastId)

    const session = {
        sessionId: sessionId,
        sessionTitle: data.title,
        sessionVideo: data.videoPath,
        sessionDocument: data.pdfPath,
        courseId: data.courseId
    }
    await insertSession(session)
}

export async function removeSession(courseId, sessionId) {
    const session = await findSession(courseId, sessionId)
    const videoPath = session.Session_Video
    const pdfPath = session.Session_Document
    if (videoPath) {
        await fs.unlink(path.resolve(videoPath))
    }
    if (pdfPath) {
        await fs.unlink(path.resolve(pdfPath))
    }

    await deleteSession(courseId, sessionId)
}

export async function updateSessionService(data) {
    const session = await findSession(data.courseId, data.sessionId)

    let videoPath = session.Session_Video
    let pdfPath = session.Session_Document

    if(data.videoPath){
        await fs.unlink(videoPath)
        videoPath = data.videoPath
    }

    if(data.pdfPath){
        await fs.unlink(pdfPath)
        pdfPath = data.pdfPath
    }

    const updatedSession = {
        sessionTitle: data.title,
        sessionVideo: videoPath,
        sessionDocument: pdfPath
    }

    await updateSession(updatedSession, data.sessionId, data.courseId)
}
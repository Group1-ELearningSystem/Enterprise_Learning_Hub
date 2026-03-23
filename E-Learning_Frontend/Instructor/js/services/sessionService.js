import api from "../../../axios/axios.js";

export async function getSessionsByCourse(courseId, token) {
    try {
        const res = await api.get(
            `/courses/${courseId}/sessions`,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        return res.data || []
    } catch (err) {
        console.log(err)
        alert("Error fetching sessions")
    }
}

export async function createSession(courseId, formData, token) {
    try {
        const res = await api.post(
            `/courses/${courseId}/sessions`, formData,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        return res.data
    } catch (err) {
        console.log(err)
        alert("Error creating sessions")
    }
}

export async function updateSession(courseId, sessionId, formData, token) {
    try {
        const res = await api.put(
            `/courses/${courseId}/sessions/${sessionId}`,formData,
            {
                headers: {Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data"}
            }
        )
        return res.data
    } catch (err) {
        console.log(err)
        alert("Error updating sessions")
    }
}

export async function deleteSession(courseId, sessionId,token) {
    try {
        const res = await api.delete(
            `/courses/${courseId}/sessions/${sessionId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        )
        return res.data
    } catch (err) {
        console.log(err)
        alert("Error deleting a session");
    }
}
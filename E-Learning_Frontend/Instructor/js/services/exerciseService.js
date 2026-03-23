import api from "../../../axios/axios.js";

export async function getExercisesBySession(courseId, sessionId, token) {
    try {
        const res = await api.get(
            `/courses/${courseId}/sessions/${sessionId}/exercises`,
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        );
        return res.data || [];
    } catch (err) {
        console.log(err)
        alert("Error loading exercises");
    }
}

export async function deleteExercise(courseId, sessionId, exerciseNo, token) {
    try {
        const res = await api.delete(
            `/courses/${courseId}/sessions/${sessionId}/exercises/${exerciseNo}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } catch(err) {
        console.log(err)
        alert("Error deleting exercises");
    }
}

export async function importExercises(courseId, sessionId, exercises, token) {
    try {
        const res = await api.post(
            `/courses/${courseId}/sessions/${sessionId}/exercises/import`, { exercise: exercises },
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        );
        return res.data;
    } catch (err) {
        console.log(err)
        alert("Error importing exercises");
    }
}
import { attachExerciseEvents, renderExerciseTable } from "../../components/exercises/exerciseTable.js";
import { getExercisesBySession } from "../../services/exerciseService.js";

export async function renderExercise() {
    const text = document.getElementById("exerciseForText");
    const exerciseBody = document.getElementById("exerciseBody");

    const course = JSON.parse(localStorage.getItem("selectedCourse"));
    const session = JSON.parse(localStorage.getItem("selectedSession"));

    text.textContent = `Exercises for Session ${session.sessionId} of (${course.title})`;

    const token = localStorage.getItem("token")
    const res = await getExercisesBySession(course.id, session.sessionId, token)

    exerciseBody.innerHTML = renderExerciseTable(res)
    attachExerciseEvents()
}
import { attachSessionEvents, renderSessionTable } from "../../components/sessions/sessionTable.js";
import { getSessionsByCourse } from "../../services/sessionService.js";

export async function renderSessions() {
    const text = document.getElementById("sessionsForText");
    const sessionsBody = document.getElementById("sessionsBody");

    const course = JSON.parse(localStorage.getItem("selectedCourse"));

    if (!text) return;
    text.textContent = course ? `Sessions for course: ${course.title}` : "No course selected";

    const token = localStorage.getItem("token")
    const res = await getSessionsByCourse(course.id, token) || []

    sessionsBody.innerHTML = renderSessionTable(res)
    attachSessionEvents(res)
}
import { deleteExercise } from "../../services/exerciseService.js";
import { loadPage } from "../../app.js";

export function renderExerciseTable(exercises) {
    return exercises.map((ex, index) =>
        `
            <tr>
                <td>${index + 1}</td>
                <td>${ex.Exercise_Question}</td>
                <td>${ex.Exercise_Answer}</td>
                <td>
                    <button class="mini-btn delete delete-ex-btn"
                        data-exercise-no="${ex.Exercise_Number}"
                        data-session-no="${ex.Session_ID}"
                        data-course-id="${ex.Course_ID}">
                        <i class="bi bi-trash"></i>
                        Delete
                    </button>
                </td>
            </tr>
        `
    ).join("")
}

export async function attachExerciseEvents() {
    const addExerciseBtn = document.getElementById("addExerciseBtn");
    const backBtn = document.getElementById("backToSessionBtn");

    document.querySelectorAll(".delete-ex-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const ok = confirm("Delete session " + btn.dataset.exerciseNo + "?");
            if (!ok) return;

            try {
                const exerciseNo = btn.dataset.exerciseNo
                const sessionId = btn.dataset.sessionNo
                const courseId = btn.dataset.courseId

                const token = localStorage.getItem("token")
                await deleteExercise(courseId, sessionId, exerciseNo, token)
                loadPage("exercises")
            } catch (err) {
                console.error(err)
                alert("Delete failed")
            }

        })
    })

    addExerciseBtn.addEventListener("click", () => {
        loadPage("add_exercises");
    })

    backBtn.addEventListener("click", () => {
        loadPage("sessions")
    })
}
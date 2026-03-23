import { loadPage } from "../../app.js";
import { deleteSession } from "../../services/sessionService.js";

export function renderSessionTable(sessions) {
    return sessions.map((s, index) =>
        `
        <tr>
            <td>${index + 1}</td>
            <td>${s.sessionTitle}</td>
            <td>
                 <button class="action-btn video preview-video-btn"
                    data-video="${s.sessionVideo}">
                    <i class="bi bi-play-circle"></i>
                    Preview Video
                </button>
            </td>
            <td>
                <button class="action-btn pdf preview-pdf-btn"
                    data-pdf="${s.sessionDocument}">
                    <i class="bi bi-file-earmark-pdf"></i>
                    Preview PDF
                </button>
            </td>
            <td>
                <div class="session-actions">
                    <button class="mini-btn edit edit-session-btn"
                        data-session-id="${s.sessionId}"
                        data-course-id="${s.courseId}">
                        <i class="bi bi-pencil-square"></i>
                        Edit
                    </button>

                    <button class="mini-btn exercise exercise-session-btn"
                        data-session-id="${s.sessionId}"
                        data-course-id="${s.courseId}">
                        <i class="bi bi-journal-text"></i>
                        Exercises
                    </button>

                    <button class="mini-btn delete delete-session-btn"
                        data-session-id="${s.sessionId}"
                        data-course-id="${s.courseId}">
                        <i class="bi bi-trash"></i>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
        `
    ).join("");
}

export async function attachSessionEvents(sessions) {
    const addSessionBtn = document.getElementById("addSessionBtn");
    const backBtn = document.getElementById("backToCoursesBtn");

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    document.querySelectorAll(".preview-pdf-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const pdfPath = btn.dataset.pdf
            if (!pdfPath) {
                alert("No PDF available for this session.");
                return;
            }
            window.open(`http://localhost:5000/${pdfPath}`, "_blank")
        })
    })

    document.querySelectorAll(".preview-video-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const videoPath = btn.dataset.video
            if (!videoPath) {
                alert("No video available for this session.");
                return;
            }
            window.open(`http://localhost:5000/${videoPath}`, "_blank")
        })
    })

    document.querySelectorAll(".delete-session-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const ok = confirm("Delete session " + btn.dataset.sessionId + "?");
            const sessionId = btn.dataset.sessionId
            const courseId = btn.dataset.courseId
            if (!ok) return

            try {
                const token = localStorage.getItem("token")
                await deleteSession(courseId, sessionId, token)
                alert("Session deleted successfully")
                loadPage("sessions")
            } catch (err) {
                console.log(err)
                alert("Delete session failed")
            }
        })
    })

    document.querySelectorAll(".edit-session-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const sessionNo = btn.dataset.sessionId
            const course = JSON.parse(localStorage.getItem("selectedCourse"))
            const session = sessions.find(s => s.sessionId === sessionNo && s.courseId === course.id)

            localStorage.setItem("editingSession", JSON.stringify(session))
            loadPage("edit_sessions")
        })
    })

    document.querySelectorAll(".exercise-session-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const sessionId = btn.dataset.sessionId;
            const courseId = btn.dataset.courseId
            localStorage.setItem("selectedSession", JSON.stringify({ sessionId, courseId }))
            loadPage("exercises");
        });
    });

    addSessionBtn.addEventListener("click", () => {
        loadPage("add_sessions")
    })
}
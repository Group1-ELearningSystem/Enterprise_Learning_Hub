import { loadPage } from "../../app.js";

export function renderCourseCards(courses) {
    return courses.map(course =>
        `<div class="course-card">
                <div>
                    <div class="course-title">${course.title}</div>

                    <div class="course-desc">${course.overview}</div>

                    <div class="course-price">RM ${course.fee}</div>

                    <span class="status-badge
                        ${course.status === "AVAILABLE" ? "status-available" : "status-unavailable"}">
                            ${course.status}
                    </span>

                </div>

                <div class="card-actions">
                    <button class="update-btn" data-course-id="${course.id}">
                        Update
                    </button>
                </div>
            </div>`
    ).join("");
}

export function attachCourseEvents(courses) {
    document.getElementById("addCourseBtn").addEventListener("click", () => {
        loadPage("add_courses")
    })

    document.querySelectorAll(".update-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedCourseId = btn.dataset.courseId
            localStorage.setItem("selectedCourseId", JSON.stringify(selectedCourseId))
            loadPage("editting_courses");
        })
    })

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const ok = confirm("Delete session " + btn.dataset.sessionId + "?");
            const deletedCourseId = btn.dataset.courseId

            if (ok) {
                const index = courses.findIndex(c => c.id === deletedCourseId)
                courses.splice(index, 1)
                alert("Deleted course successfully");
                loadPage("courses")
            }

        })
    })
}
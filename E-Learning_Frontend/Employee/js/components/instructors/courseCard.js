import { renderStars } from "../../../../utils/RenderRatingStar.js";
import { openFeedbackModal } from "./courseFeedback.js";

export function renderCourseCards(courses) {
    return courses.map(course =>
        `<div class="course-card">
            <div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-desc">${course.overview}</p>
            </div>

            <div class="course-rating">
                ${course.total_reviews > 0 ? `${renderStars(course.avg_rating)}
                    <span>(${course.avg_rating}/5 - ${course.total_reviews} reviews)</span>`
            : `<span>No ratings yet</span>`}
            </div>

            <div class="course-footer">
                <button class="app-btn secondary w-100 edit-course-btn mb-2"
                    data-course-id="${course.id}">
                    View Feedbacks
                </button>
            </div>
        </div>`
    ).join("");
}

export function attachCourseEvents() {
    document.querySelectorAll(".edit-course-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = btn.dataset.courseId
            console.log(courseId)
            openFeedbackModal(courseId)
        })
    })
}
import { renderStars } from "../../../../utils/RenderRatingStar.js"
import { renderPagination } from "../../../../utils/RenderPagination.js"
import { getCourseFeedbacks } from "../../services/courseService.js"
import { formatDate } from "../../../../utils/DateFormatUtils.js"

export async function loadFeedbacks(courseId, page = 1) {
    try {
        const token = localStorage.getItem("token")
        const feedbacks = await getCourseFeedbacks(courseId, 1, token)

        renderFeedbacks(feedbacks)
        renderPagination(page,
            (newPage) => loadFeedbacks(courseId, newPage)
        );
    } catch (err) {
        console.error(err)
        alert("Failed to load feedbacks")
    }
}

function renderFeedbacks(feedbacks) {
    const list = document.getElementById("feedbackList")
    const avgBox = document.getElementById("avgRating")
    if (!feedbacks.length) {
        list.innerHTML = "<p>No feedback yet</p>"
        avgBox.innerHTML = ""
        return
    }

    const avg = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length

    avgBox.innerHTML =
        `
        <div class="mb-2">
            ${renderStars(avg)}
            <span>(${avg.toFixed(1)} / 5)</span>
        </div>
    `

    list.innerHTML = feedbacks.map(f =>
        `
            <div class="feedback-item">
                <div class="feedback-stars">
                    ${renderStars(f.rating)}
                </div>

                <p class="feedback-comment">
                    ${f.comment}
                </p>

                <small class="feedback-author">
                    By ${f.learnerName} - ${formatDate(f.createdAt)}
                </small>
            </div>
    `).join("")
}

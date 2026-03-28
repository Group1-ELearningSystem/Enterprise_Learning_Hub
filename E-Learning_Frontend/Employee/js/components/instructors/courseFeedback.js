import { loadFeedbacks } from "../courses/courseFeedback.js";

export function openFeedbackModal(courseId) {
    document.getElementById("feedbackModal").classList.add("active");
    setupFeedbackModal()
    loadFeedbacks(courseId, 1);
}

export function setupFeedbackModal() {
    document.getElementById("closeFeedbackModal").addEventListener("click",
        closeFeedbackModal
    );
}

function closeFeedbackModal() {
    document.getElementById("feedbackModal").classList.remove("active");
}

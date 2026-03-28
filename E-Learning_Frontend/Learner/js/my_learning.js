import api from "../axios/axios.js";
import { formatPrice } from "./app.js";
const myLearningList = document.getElementById("myLearningList");

function goToSession(courseId) {
    window.location.href = `session.html?courseId=${encodeURIComponent(courseId)}`;
}

function formatPrice(price) {
    return Number(price) === 0
        ? "Free"
        : Number(price).toLocaleString("vi-VN") + " VND";
}

function renderMyCourses(courses) {
    myLearningList.innerHTML = "";

    if (!courses.length) {
        myLearningList.innerHTML = `
            <div class="card">
                <p>You have not enrolled in any courses yet.</p>
            </div>
        `;
        return;
    }

    courses.forEach((course) => {
        const item = document.createElement("div");
        item.className = "course-card";

        const isActive = course.subscriptionStatus === "Active";

        item.innerHTML = `
            <div class="course-thumb">
                <span class="course-badge">${course.fieldName || "General"}</span>
            </div>
            <div class="course-body">
                <h3>${course.courseName}</h3>
                <div class="course-meta">
                    <span>${course.subscriptionStatus}</span>
                    <span>${formatPrice(course.courseFee)}</span>
                </div>
                <p class="course-desc">
                    ${course.courseOverview || "Continue your learning journey."}
                </p>
                <div class="progress-wrap">
                    <div class="progress-bar" style="width:${isActive ? 10 : 0}%"></div>
                </div>
                <div class="course-footer">
                    <span class="price">${isActive ? "Ready to learn" : course.subscriptionStatus}</span>
                    <button class="btn btn-primary" ${!isActive ? "disabled" : ""}>
                        ${isActive ? "Continue" : "Unavailable"}
                    </button>
                </div>
            </div>
        `;

        const btn = item.querySelector("button");
        if (isActive) {
            btn.addEventListener("click", () => goToSession(course.courseId));
        }

        myLearningList.appendChild(item);
    });
}

async function loadMyCourses() {
    try {
        myLearningList.innerHTML = `
            <div class="card">
                <p>Loading your courses...</p>
            </div>
        `;

        const response = await api.get("/learner/my-courses");
        renderMyCourses(response.data || []);
    } catch (error) {
        console.error("Load my courses failed:", error);

        const message =
            error.response?.data?.message || "Failed to load your courses.";

        if (error.response?.status === 401) {
            myLearningList.innerHTML = `
                <div class="card">
                    <p>Please login as learner first.</p>
                </div>
            `;
            return;
        }

        myLearningList.innerHTML = `
            <div class="card">
                <p>${message}</p>
            </div>
        `;
    }
}

loadMyCourses();
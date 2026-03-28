import api from "../axios/axios.js";
import { formatPrice, getCourseIdFromUrl } from "./app.js";
const courseDetail = document.getElementById("courseDetail");

function getCourseIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("courseId");
}

function formatPrice(price) {
    return Number(price) === 0
        ? "Free"
        : Number(price).toLocaleString("vi-VN") + " VND";
}

function goToLearning(courseId) {
    window.location.href = `my_learning.html?courseId=${encodeURIComponent(courseId)}`;
}

async function enrollFreeCourse(courseId) {
    try {
        const response = await api.post(`/learner/courses/${courseId}/register-free`);
        alert(response.data.message || "Enroll successful!");
        goToLearning(courseId);
    } catch (error) {
        console.error("Register free failed:", error);
        const message =
            error.response?.data?.message || "Failed to enroll this course.";
        alert(message);
    }
}

async function loadCourseDetail() {
    const courseId = getCourseIdFromUrl();

    if (!courseId) {
        courseDetail.innerHTML = `
            <div class="card">
                <p>Course ID is missing.</p>
            </div>
        `;
        return;
    }

    try {
        courseDetail.innerHTML = `
            <div class="card">
                <p>Loading course detail...</p>
            </div>
        `;

        const response = await api.get(`/learner/courses/${courseId}`);
        const data = response.data;

        const course = data.course;
        const isSubscribed = data.isSubscribed;
        const subscriptionStatus = data.subscriptionStatus;
        const isFree = Number(data.effectiveFee || 0) === 0;

        let actionButton = "";

        if (isSubscribed && subscriptionStatus === "Active") {
            actionButton = `
                <button id="mainActionBtn" class="btn btn-primary" style="width:100%;">
                    Go to Learning
                </button>
            `;
        } else if (!isSubscribed && isFree) {
            actionButton = `
                <button id="mainActionBtn" class="btn btn-primary" style="width:100%;">
                    Enroll Now
                </button>
            `;
        } else if (isSubscribed) {
            actionButton = `
                <button class="btn btn-outline" style="width:100%;" disabled>
                    ${subscriptionStatus || "Subscribed"}
                </button>
            `;
        } else {
            actionButton = `
                <button class="btn btn-outline" style="width:100%;" disabled>
                    Paid Course
                </button>
            `;
        }

        courseDetail.innerHTML = `
            <div class="page-header">
                <div>
                    <h1>${course.courseName}</h1>
                    <p>Explore this course and build your skills step by step.</p>
                </div>
                <button class="btn btn-outline" onclick="history.back()">Back</button>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1.4fr; gap:24px;">
                <div class="card">
                    <div class="course-thumb" style="height:220px; border-radius:18px;"></div>
                    <div style="margin-top:18px;">
                        <p style="margin-bottom:10px;"><strong>Category:</strong> ${course.fieldName || "General"}</p>
                        <p style="margin-bottom:10px;"><strong>Status:</strong> ${course.courseStatus || "Active"}</p>
                        <p class="price" style="font-size:24px; margin:18px 0;">
                            ${formatPrice(course.courseFee)}
                        </p>
                        ${actionButton}
                    </div>
                </div>

                <div class="card">
                    <h2 class="section-title">About This Course</h2>
                    <p style="color: var(--muted); margin-bottom: 22px;">
                        ${course.courseOverview || "No overview available."}
                    </p>

                    <h2 class="section-title">What You Will Learn</h2>
                    <div class="lesson-item active">${course.courseObjective || "Course objectives will be updated soon."}</div>
                    <div class="lesson-item">Track your learning progress</div>
                    <div class="lesson-item">Access course content after subscription</div>
                    <div class="lesson-item">Continue learning from My Learning page</div>
                </div>
            </div>
        `;

        const actionBtn = document.getElementById("mainActionBtn");
        if (actionBtn) {
            if (isSubscribed && subscriptionStatus === "Active") {
                actionBtn.addEventListener("click", () => goToLearning(courseId));
            } else if (!isSubscribed && isFree) {
                actionBtn.addEventListener("click", () => enrollFreeCourse(courseId));
            }
        }
    } catch (error) {
        console.error("Load course detail failed:", error);

        const message =
            error.response?.data?.message || "Failed to load course detail.";

        if (error.response?.status === 401) {
            courseDetail.innerHTML = `
                <div class="card">
                    <p>Please login as learner to view this course.</p>
                </div>
            `;
            return;
        }

        courseDetail.innerHTML = `
            <div class="card">
                <p>${message}</p>
            </div>
        `;
    }
}

loadCourseDetail();
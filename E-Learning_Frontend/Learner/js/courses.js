import api from "../axios/axios.js";
import { formatPrice } from "./app.js";

const courseList = document.getElementById("courseList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

let allCourses = [];

function formatPrice(price) {
    return Number(price) === 0
        ? "Free"
        : Number(price).toLocaleString("vi-VN") + " VND";
}

function normalizeCourse(course) {
    return {
        id: course.courseId,
        title: course.courseName,
        category: course.fieldName || "General",
        price: Number(course.courseFee || 0),
        description: course.courseOverview || "No description available.",
        lessons: course.totalSessions || 0,
        level: course.level || "All Levels",
        objective: course.courseObjective || ""
    };
}

function renderCourses(courses) {
    courseList.innerHTML = "";

    if (!courses.length) {
        courseList.innerHTML = `
            <div class="card">
                <p>No courses found.</p>
            </div>
        `;
        return;
    }

    courses.forEach((course) => {
        const card = document.createElement("div");
        card.className = "course-card";

        card.innerHTML = `
            <div class="course-thumb">
                <span class="course-badge">${course.category}</span>
            </div>
            <div class="course-body">
                <h3>${course.title}</h3>
                <div class="course-meta">
                    <span>${course.lessons} lessons</span>
                    <span>${course.level}</span>
                </div>
                <p class="course-desc">${course.description}</p>
                <div class="course-footer">
                    <span class="price">${formatPrice(course.price)}</span>
                    <button class="btn btn-primary" data-id="${course.id}">View</button>
                </div>
            </div>
        `;

        const btn = card.querySelector("button");
        btn.addEventListener("click", () => viewCourse(course.id));

        courseList.appendChild(card);
    });
}

function filterCourses() {
    const keyword = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const price = priceFilter.value;

    const filtered = allCourses.filter((course) => {
        const matchKeyword = course.title.toLowerCase().includes(keyword);
        const matchCategory = category === "all" || course.category === category;
        const matchPrice =
            price === "all" ||
            (price === "free" && course.price === 0) ||
            (price === "paid" && course.price > 0);

        return matchKeyword && matchCategory && matchPrice;
    });

    renderCourses(filtered);
}

function viewCourse(id) {
    window.location.href = `course_detail.html?courseId=${encodeURIComponent(id)}`;
}

async function loadCourses() {
    try {
        courseList.innerHTML = `<div class="card"><p>Loading courses...</p></div>`;

        const response = await api.get("/learner/courses");
        allCourses = (response.data.courses || []).map(normalizeCourse);

        renderCourses(allCourses);
    } catch (error) {
        console.error("Load courses failed:", error);
        courseList.innerHTML = `
            <div class="card">
                <p>Failed to load courses.</p>
            </div>
        `;
    }
}

searchInput.addEventListener("input", filterCourses);
categoryFilter.addEventListener("change", filterCourses);
priceFilter.addEventListener("change", filterCourses);

loadCourses();
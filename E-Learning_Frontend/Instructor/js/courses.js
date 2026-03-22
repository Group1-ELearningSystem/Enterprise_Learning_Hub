import { loadPage } from "./app.js";
import api from "../../axios/axios.js"
import { formatDate } from "../../utils/DateFormatUtils.js";
import { renderStars } from "../../utils/RenderRatingStar.js"
import { renderPagination } from "../../utils/RenderPagination.js";
import { renderSuggestions } from "../../utils/RenderSuggestion.js";

let allCourses = [];

//========================SEARCHING SETUP SECTION=================================//
export function setupCourseSearch({ onReset, onSelect, hidePagination = false }) {
    console.log("setupCourseSearch initialized");
    const searchInput = document.getElementById("courseSearch");
    const suggestionsBox = document.getElementById("suggestions");
    const pagination = document.getElementById("pagination");

    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const keyword = searchInput.value.trim();
            if (keyword.length < 2) {
                suggestionsBox.innerHTML = "";
                suggestionsBox.style.display = "none";
                onReset?.();
                if (pagination && !hidePagination) {
                    pagination.style.display = "block";
                }
                return;
            }

            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/courses/search?q=${keyword}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const results = res.data || [];

                renderSuggestions(
                    results,
                    onSelect
                );

                if (pagination) {
                    pagination.style.display = "none";
                }
            }
            catch (err) {
                console.error(err);
            }
        }, 300);
    }
    );
}

export function selectCourseFromSearch(courseId) {
    const selected = allCourses.find(c => c.id == courseId);
    if (!selected) return;
    renderFilteredCourses([selected]);
    document.getElementById("suggestions").style.display = "none";
}
//====================================================================================//

//===============================RENDER COURSE SECTION================================//
export function renderFilteredCourses(courses) {
    const grid = document.getElementById("coursesGrid");
    grid.innerHTML = courses.map(course =>
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
                    Edit Course
                </button>

                <button class="app-btn primary w-100 manage-sessions-btn"
                    data-course-id="${course.id}">
                    Manage Sessions
                </button>
            </div>
        </div>`
    ).join("");

    attachCourseEvents(courses);
}

function attachCourseEvents(courses) {
    document.querySelectorAll(".manage-sessions-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = btn.dataset.courseId;
            const course = courses.find(c => c.id == courseId);

            localStorage.setItem("selectedCourse", JSON.stringify(course));
            loadPage("sessions");
        });
    });

    document.querySelectorAll(".edit-course-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const courseId = btn.dataset.courseId;
            const course = courses.find(c => c.id == courseId);

            localStorage.setItem("selectedCourse", JSON.stringify(course));
            loadPage("edit_courses");
        });
    });
}

export async function renderCourses() {
    const grid = document.getElementById("coursesGrid")

    const loginUser = JSON.parse(localStorage.getItem("loginUser"))
    const token = localStorage.getItem("token")

    const res = await api.get(`/instructor/${loginUser.Instructor_ID}/courses`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    )
    const courses = await res.data || []

    allCourses = courses
    renderFilteredCourses(courses)

    setupCourseSearch({
        onReset: () => {
            renderFilteredCourses(allCourses);
        },
        onSelect: selectCourseFromSearch
    });
}
//==================================================================================//

//=================================POPULATE FIELD COMBO BOX==============================//
async function loadFields() {

    try {
        const res = await api.get("/fields")
        const select = document.getElementById("courseField")

        select.innerHTML = ""
        res.data.forEach(field => {
            const option = document.createElement("option")
            option.value = field.Field_Name
            option.textContent = field.Field_Name
            select.appendChild(option)
        })
    } catch(err) {
        console.error(err)
    }
}
//=====================================================================================//

//===============================ADDING COURSE SECTION===================================//
export function setupAddingCourses() {
    const form = document.getElementById("addCourseForm")
    const backBtn = document.getElementById("backToCoursesBtn")

    loadFields();

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const loginUser = JSON.parse(localStorage.getItem("loginUser"))

        const title = document.getElementById("courseTitle").value.trim();
        const objective = document.getElementById("courseObjective").value.trim()
        const description = document.getElementById("courseDesc").value.trim();
        const price = document.getElementById("coursePrice").value.trim();
        const status = document.getElementById("courseStatus").value
        const fieldName = document.getElementById("courseField").value

        if (!title || !objective || !description || !price) {
            alert("Please fill all fields.");
            return;
        }

        const newCourse = {
            courseName: title,
            overview: description,
            objective: objective,
            fee: price,
            status: status,
            fieldName: fieldName
        }

        try {
            const token = localStorage.getItem("token")
            await api.post("/courses", newCourse, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert("Course created successfully!")
            loadPage("courses")
        } catch (err) {
            console.error(err)
            alert("Failed to create course")
        }
    })
}
//=================================================================================//

//=================================RATING FEEDBACK SECTION=================================//
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

async function loadFeedbacks(courseId, page = 1) {
    try {
        const token = localStorage.getItem("token")
        const feedbacks = await api.get(`/courses/${courseId}/feedbacks?page=${page}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        renderFeedbacks(feedbacks.data)
        renderPagination(page,
            (newPage) => loadFeedbacks(courseId, newPage)
        );
    } catch (err) {
        console.error(err)
        alert("Failed to load feedbacks")
    }
}
//===========================================================================//

//===========================LOAD EDIT COURSE DETAIL==============================//
async function loadCourseEarnings(courseId) {
    try {
        const token = localStorage.getItem("token")
        const res = await api.get(`/courses/${courseId}/earnings`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        document.getElementById("totalSubscribers").textContent = data.total_subscribers || 0;
        document.getElementById("totalEarned").textContent = (data.total_earned || 0).toFixed(2);
    } catch (err) {
        console.error(err);
    }
}

export function setupEditCourse() {
    const form = document.getElementById("addCourseForm")
    const backBtn = document.getElementById("backToCoursesBtn")

    const course = JSON.parse(localStorage.getItem("selectedCourse"))

    document.getElementById("courseTitle").value = course.title
    document.getElementById("courseObjective").value = course.objective
    document.getElementById("courseDesc").value = course.overview
    document.getElementById("coursePrice").value = course.fee
    document.getElementById("courseStatus").value = course.status

    loadFeedbacks(course.id)
    loadCourseEarnings(course.id)

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const updatedCourse = {
            courseName: document.getElementById("courseTitle").value.trim(),
            objective: document.getElementById("courseObjective").value.trim(),
            overview: document.getElementById("courseDesc").value.trim(),
            fee: document.getElementById("coursePrice").value,
            status: document.getElementById("courseStatus").value
        }

        try {
            const token = localStorage.getItem("token")
            await api.put(`/courses/${course.id}`, updatedCourse, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert("Course updated successfully")
            loadPage("courses")
        } catch (err) {
            console.error(err)
            alert("Update failed")
        } finally {
            localStorage.removeItem("selectedCourse")
        }
    })
}
//======================================================================//

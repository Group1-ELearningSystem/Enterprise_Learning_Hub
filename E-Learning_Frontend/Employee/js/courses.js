import { loadPage } from "./app.js";
import api from "../../axios/axios.js";
import { renderPagination } from "../../utils/RenderPagination.js";
import { renderStars } from "../../utils/RenderRatingStar.js";
import { formatDate } from "../../utils/DateFormatUtils.js";

let allCourses = []
let searchResults = []
let selectedInstructorId = null

//============================SETUP COURSE SEARCH SECTION================================//
export async function selectCourseFromSearch(courseId) {
    const selected = searchResults.find(c => c.id == courseId);
    if (!selected) return;
    renderFilteredCourse([selected]);
    document.getElementById("suggestions").style.display = "none";
    document.getElementById("pagination").style.display = "none";
}

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
//=====================================================================================//

//==========================SEARCH INSTRUCTOR SECTION===============================//
export function setupInstructorSearch() {
    const input = document.getElementById("instructorSearch")
    const suggestionBox = document.getElementById("instructorSuggestions")

    let debounceTimer

    input.addEventListener("input", () => {
        clearTimeout(debounceTimer)
        const keyword = input.value.trim()

        if (keyword.length < 2) {
            suggestionBox.style.display = "none"
            return
        }
        debounceTimer = setTimeout(() => {
            searchInstructor(keyword)
        }, 400)
    })
}

async function searchInstructor(keyword) {
    try {
        const token = localStorage.getItem("token")
        const res = await api.get(`/instructors/search?q=${keyword}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        renderInstructorSuggestions(res.data)
    } catch (err) {
        console.error(err)
    }
}

function renderInstructorSuggestions(instructors) {
    const suggestionBox = document.getElementById("instructorSuggestions")
    suggestionBox.innerHTML = ""
    if (instructors.length === 0) {
        suggestionBox.style.display = "none"
        return
    }
    instructors.forEach(instructor => {
        const item = document.createElement("div")
        item.classList.add("suggestion-item")
        item.innerHTML =
            `
            <strong>
                ${instructor.Instructor_Full_Name}
            </strong>
            <br>

            <small>
                ID: ${instructor.Instructor_ID}
                | ${instructor.Instructor_Email_Address}
                | ${instructor.Instructor_Phone_Number}
            </small>
        `
        item.addEventListener("click", () => {
            selectInstructor(instructor)
        })
        suggestionBox.appendChild(item)
    })
    suggestionBox.style.display = "block"
}

function selectInstructor(instructor) {
    const input = document.getElementById("instructorSearch")
    const suggestionBox = document.getElementById("instructorSuggestions")
    input.value = `${instructor.Instructor_Full_Name} (ID: ${instructor.Instructor_ID})`
    selectedInstructorId = instructor.Instructor_ID
    suggestionBox.style.display = "none"
}
//------------------------------------------------------------//

//------------------------POPULATE FIELDS COMBOBOX-----------------------//
async function loadFields(selectedField) {
    try {
        const token = localStorage.getItem("token")
        const res = await api.get("/fields", {
            headers: { Authorization: `Bearer ${token}` }
        })
        const select = document.getElementById("empFieldSelect")

        select.innerHTML = ""
        res.data.forEach(field => {
            const option = document.createElement("option")
            option.value = field.Field_Name
            option.textContent = field.Field_Name
            if (field.Field_Name === selectedField) {
                option.selected = true
            }
            select.appendChild(option)
        })
    } catch (err) {
        console.error(err)
    }
}
//-------------------------------------------------------------//

//------------------------------RENDER COURSES----------------------------------//
function renderFilteredCourse(courseList) {
    const courseGrid = document.getElementById("courseGrid");
    if (!courseGrid) return;

    if (!courseList || courseList.length === 0) {
        courseGrid.innerHTML = `<p>No courses found.</p>`;
        return;
    }

    courseGrid.innerHTML = courseList.map(course =>
        `
            <div class="course-card">
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
                    ${course.status !== "AVAILABLE" ? `<button class="delete-btn" data-course-id="${course.id}">
                            Delete
                        </button>
                        `: ""
        }
                </div>
            </div>
        `
    ).join("");

    attachCourseEvents(courseList);
}

function attachCourseEvents(courses) {
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

export async function courseRender(page = 1) {
    try {
        const limit = 6
        const token = localStorage.getItem("token")
        const res = await api.get(`/courses?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data || []
        searchResults = data.courses

        setupCourseSearch({
            onReset: () => {
                courseRender(1)
            },
            onSelect: selectCourseFromSearch,
            hidePagination: false
        });

        renderFilteredCourse(
            data.courses
        );

        renderPagination(
            data.page,
            courseRender
        );
    } catch (err) {
        console.log(err)
        alert("Failed loading course")
    }
}
//---------------------------------------------------------------------------//

//----------------------------RATING FEEDBACK SECTION---------------------------------//
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
//-----------------------------------------------------------------//

//---------------------------EDIT COURSE DETAILS-----------------------------------//
export async function openEditCourse(courseId) {
    try {
        const token = localStorage.getItem("token")
        const res = await api.get(`/courses/${courseId}`,
            {
                headers: { Authorization: `Bearer ${token}`}
            }
        )
        const course = res.data
        LoadCourseToForm(course)
    } catch (err) {
        console.error(err)
    }
}

export async function LoadCourseToForm(selectedCourse) {
    const editingForm = document.getElementById("addCourseForm")
    const courseTitle = document.getElementById("courseTitle")
    const courseOverview = document.getElementById("courseOverview")
    const courseObjective = document.getElementById("courseObjective")
    const coursePrice = document.getElementById("coursePrice")
    const courseStatus = document.getElementById("courseStatus")
    const courseInstructor = document.getElementById("courseInstructor")
    const courseField = document.getElementById("empFieldSelect")

    await loadFields(selectedCourse.Field_Name)
    loadFeedbacks(selectedCourse.Course_ID)

    courseTitle.value = selectedCourse.Course_Name;
    courseOverview.value = selectedCourse.Course_Overview
    courseObjective.value = selectedCourse.Course_Objective
    coursePrice.value = selectedCourse.Course_Fee
    courseStatus.value = selectedCourse.Course_Status;
    courseInstructor.value = `${selectedCourse.Instructor_ID} - ${selectedCourse.Instructor_Name}`

    editingForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const updatedCourse = {
            courseName: courseTitle.value,
            overview: courseOverview.value,
            objective: courseObjective.value,
            fee: coursePrice.value,
            status: courseStatus.value,
            fieldName: courseField.value

        }
        try {
            const token = localStorage.getItem("token")
            await api.put(`/courses/${selectedCourse.Course_ID}`, updatedCourse,
                {
                    headers: { Authorization: `Bearer ${token}`}
                }
            )
            alert("Course updated successfully!")
            loadPage("courses")
        } catch (err) {
            console.error(err)
            alert("Update failed")
        }
    })
}
//-----------------------------------------------------------------------//

//-------------------------------ADDING COURSES SECTION-------------------------------------//
export function setupAddingEmployeeCourses() {
    const form = document.getElementById("addEmployeeCourseForm")
    const backBtn = document.getElementById("backToEmployeeCoursesBtn")

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    loadFields()
    setupInstructorSearch();

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const title = document.getElementById("empCourseTitle").value.trim()
        const fieldName = document.getElementById("empFieldSelect").value
        const objective = document.getElementById("empCourseObjective").value.trim()
        const description = document.getElementById("empCourseDesc").value.trim()
        const price = document.getElementById("empCoursePrice").value.trim()
        const status = document.getElementById("empCourseStatus").value

        if (!title || !fieldName || !objective || !description || !price) {
            alert("Please fill all fields.")
            return
        }

        const newCourse = {
            courseName: title,
            overview: description,
            objective: objective,
            fee: price,
            status: status,
            instructorId: selectedInstructorId,
            fieldName: fieldName
        }

        try {
            const token = localStorage.getItem("token")
            await api.post("/courses", newCourse,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            alert("Course created successfully!")
            loadPage("courses")
        } catch (err) {
            console.error(err)
            alert("Failed to create course")
        }
    })
}
//------------------------------------------------------------------------------//
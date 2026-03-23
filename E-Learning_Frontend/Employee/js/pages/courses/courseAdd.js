import { loadFields } from "../../components/courses/courseField.js"
import { getSelectedInstructorId } from "../../components/instructors/instructorSearch.js"
import { setupInstructorSearch } from "../../components/instructors/instructorSearch.js"
import { loadPage } from "../../app.js"

export async function setupAddingEmployeeCourses() {
    const form = document.getElementById("addEmployeeCourseForm")
    const backBtn = document.getElementById("backToEmployeeCoursesBtn")

    backBtn.addEventListener("click", () => {
        loadPage("courses")
    })

    await loadFields()
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
            instructorId: getSelectedInstructorId,
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
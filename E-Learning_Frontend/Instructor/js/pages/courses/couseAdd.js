import { loadFields } from "../../components/courses/courseField.js";
import { loadPage } from "../../app.js";
import { createCourse } from "../../services/courseService.js";

export async function setupAddingCourses() {
    const form = document.getElementById("addCourseForm")
    const backBtn = document.getElementById("backToCoursesBtn")

    await loadFields();

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
            await createCourse(newCourse, token)
            alert("Course created successfully!")
            loadPage("courses")
        } catch (err) {
            console.error(err)
            alert("Failed to create course")
        }
    })
}
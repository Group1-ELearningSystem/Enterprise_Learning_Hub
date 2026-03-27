import { loadFeedbacks } from "../../components/courses/courseFeedback.js";
import { getCourseById, getCourseEarnings } from "../../services/courseService.js";
import { updateCourse } from "../../services/courseService.js";
import { loadFields } from "../../components/courses/courseField.js";
import { loadPage } from "../../app.js";
import { setupCourseEarningDetails } from "./courseEarning.js";
import { loadCourseQuestions } from "../../components/courses/courseQA.js";

async function loadCourseEarnings(courseId) {
    try {
        const token = localStorage.getItem("token")
        const res = await getCourseEarnings(courseId, token)
        const data = res;
        document.getElementById("totalSubscribers").textContent = data.total_subscribers || 0;
        document.getElementById("totalEarned").textContent = (data.total_earned || 0).toFixed(2);
    } catch (err) {
        console.error(err);
    }
}

export async function setupEditCourse(courseId) {
    const form = document.getElementById("addCourseForm")
    const backBtn = document.getElementById("backToCoursesBtn")

    const token = localStorage.getItem("token")
    const course = await getCourseById(courseId, token)

    await loadFields()

    document.getElementById("courseTitle").value = course.Course_Name
    document.getElementById("courseObjective").value = course.Course_Objective
    document.getElementById("courseDesc").value = course.Course_Overview
    document.getElementById("coursePrice").value = course.Course_Fee
    document.getElementById("courseStatus").value = course.Course_Status
    document.getElementById("courseField").value = course.Field_Name

    loadFeedbacks(course.Course_ID)
    await loadCourseQuestions(courseId, 1)
    loadCourseEarnings(course.Course_ID)
    setupCourseEarningDetails(course.Course_ID, 1)

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
            status: document.getElementById("courseStatus").value,
            fieldName: document.getElementById("courseField").value
        }

        try {
            const token = localStorage.getItem("token")
            await updateCourse(course.Course_ID, updatedCourse, token)

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
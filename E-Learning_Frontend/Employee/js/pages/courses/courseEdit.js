import { getCourseById } from "../../services/courseService.js"
import { loadFields } from "../../components/courses/courseField.js"
import { loadFeedbacks } from "../../components/courses/courseFeedback.js"
import { loadPage } from "../../app.js"
import { updateCourse } from "../../services/courseService.js"

export async function openEditCourse(courseId) {
    try {
        const token = localStorage.getItem("token")
        const res = await getCourseById(courseId, token)
        LoadCourseToForm(res)
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
    await loadFeedbacks(selectedCourse.Course_ID, 1)

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
            await updateCourse(selectedCourse.Course_ID, updatedCourse, token)
           
            alert("Course updated successfully!")
            loadPage("courses")
        } catch (err) {
            console.error(err)
            alert("Update failed")
        }
    })
}
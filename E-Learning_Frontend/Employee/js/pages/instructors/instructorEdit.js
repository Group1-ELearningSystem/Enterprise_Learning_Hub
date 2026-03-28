import { loadPage } from "../../app.js";
import { getInstructorById, updateInstructor } from "../../services/instructorService.js";
import { getInstructorCourses } from "../../../../Instructor/js/services/courseService.js";
import { attachCourseEvents, renderCourseCards } from "../../components/instructors/courseCard.js";

export async function openEditInstructor(selectedInstructorId) {
    try {
        const token = localStorage.getItem("token")
        const res = await getInstructorById(selectedInstructorId, token)
        LoadInstructorToForm(res)
        await LoadInstructorCourse(selectedInstructorId)
        attachCourseEvents()
    } catch (err) {
        console.error(err)
    }
}

export async function LoadInstructorToForm(selectedInstructor) {
    const form = document.getElementById("addInstructorForm")

    document.getElementById("insName").value = selectedInstructor.Instructor_Full_Name;
    document.getElementById("insEmail").value = selectedInstructor.Instructor_Email_Address;
    document.getElementById("insPhone").value = selectedInstructor.Instructor_Phone_Number;

    document.getElementById("accUsername").value = selectedInstructor.Account_Username;
    document.getElementById("accPassword").value = selectedInstructor.Account_Password;
    document.getElementById("accountStatus").value = selectedInstructor.Account_Status;

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const status = document.getElementById("accountStatus").value;
        try {
            const token = localStorage.getItem("token")
            await updateInstructor(selectedInstructor.Instructor_ID, status, token)
            loadPage("instructors")
        } catch (err) {
            console.log(err)
            alert("Update Instructor Failed")
        }
    })
}

export async function LoadInstructorCourse(instructorId) {
    const token = localStorage.getItem("token")
    const courses = await getInstructorCourses(instructorId, token)
    const container = document.getElementById("instructorCoursesContainer");
    container.innerHTML = renderCourseCards(courses);
}
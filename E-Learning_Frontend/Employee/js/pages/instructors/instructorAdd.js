import { addInstructor } from "../../services/instructorService.js";
import { loadPage } from "../../app.js";

export async function setupAddingInstructor() {
    const form = document.getElementById("addInstructorForm")

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const name = document.getElementById("insName").value;
        const email = document.getElementById("insEmail").value
        const phone = document.getElementById("insPhone").value;
        const gender = document.getElementById("insGender").value

        const newInstructor = {
            name,
            email,
            phone,
        }

        const token = localStorage.getItem('token')
        await addInstructor(newInstructor, token)

        alert("New instructor and account created")
        form.reset()
        loadPage("instructors")
    })
}
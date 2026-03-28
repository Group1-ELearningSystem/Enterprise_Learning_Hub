import { addEmployee } from "../../services/employeeService.js"
import { loadPage } from "../../app.js"

export function setupAddingEmployee() {
    const form = document.getElementById("addEmployeeForm")

    form.addEventListener("submit", async (e) => {
        e.preventDefault()

        const name = document.getElementById("insName").value
        const email = document.getElementById("insEmail").value
        const phone = document.getElementById("insPhone").value
        const gender = document.getElementById("insGender").value
        const dob = document.getElementById("insDob").value
        const address = document.getElementById("insAddress").value

        const newEmployee = {
            name,
            email,
            phone,
            gender,
            dob,
            address,
        }

        try {
            const token = localStorage.getItem("token")
            await addEmployee(newEmployee, token)
            alert("Employee created successfully")
            form.reset()
            loadPage("employees")
        } catch (err) {
            console.log(err)
            alert("Error creating new employees")
        }   
    })
}
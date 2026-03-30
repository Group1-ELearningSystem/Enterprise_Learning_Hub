import { loadPage } from "../../app.js";
import { updateInstructor } from "../../services/instructorService.js";
import { getInstructorCourses } from "../../../../Instructor/js/services/courseService.js";
import { renderCourseCards } from "../../components/instructors/courseCard.js";
import { getEmployeeById, updateEmployee } from "../../services/employeeService.js";

export async function openEditEmployee(selectedEmployeeId) {
    try {
        const token = localStorage.getItem("token")
        const res = await getEmployeeById(selectedEmployeeId, token)
        LoadEmployeeToForm(res)
    } catch (err) {
        console.error(err)
    }
}

export async function LoadEmployeeToForm(selectedEmployee) {
    const form = document.getElementById("addEmployeeForm")

    document.getElementById("insName").value = selectedEmployee.Employee_Full_Name;
    document.getElementById("insEmail").value = selectedEmployee.Employee_Email_Address;
    document.getElementById("insPhone").value = selectedEmployee.Employee_Phone_Number;
    document.getElementById("insGender").value = selectedEmployee.Employee_Gender; 
    document.getElementById("insDob").value = selectedEmployee.Employee_DOB.split('T')[0]
    document.getElementById("insAddress").value = selectedEmployee.Employee_Address;

    document.getElementById("accUsername").value = selectedEmployee.Account_Username;
    document.getElementById("accPassword").value = selectedEmployee.Account_Password;
    document.getElementById("accRole").value = selectedEmployee.Account_Roles;
    document.getElementById("accountStatus").value = selectedEmployee.Account_Status;

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const status = document.getElementById("accountStatus").value;
        try {
            const token = localStorage.getItem("token")
            await updateEmployee(selectedEmployee.Employee_ID, status, token)
            loadPage("employees")
        } catch (err) {
            console.log(err)
            alert("Update Employee Failed")
        }
    })
}
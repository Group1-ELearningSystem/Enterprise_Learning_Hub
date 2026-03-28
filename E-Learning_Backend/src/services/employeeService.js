import { getAllEmployee, getEmployeeById, insertEmployee, searchEmployee, updateEmployee } from "../repository/employeeRepository.js"
import { sendEmail } from "../utils/emailUtils.js"

export async function searchEmployeeService(keyword) {
    if (!keyword || keyword.length < 2) {
        return []
    }
    const instructors = await searchEmployee(keyword)
    return instructors
}

export async function getAllEmployeeService() {
    const instructors = await getAllEmployee()
    return instructors
}

export async function getEmployeeByIdService(id) {
    const instructor = await getEmployeeById(id)
    return instructor
}

export async function addEmployeeService(data) {
    const result = await insertEmployee(data)
    const defaultPassword = "Temp@123";
    await sendEmail(data.email, "The credentials for your account", `Please using these credentials for login: ${data.email} - ${defaultPassword}`)
    return result
}

export async function updateEmployeeService(employeeId, status) {
    await updateEmployee(employeeId, status)
    return {
        message: "Employee updated successfully"
    }
}
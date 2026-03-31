import { getInstructorById, insertInstructor, searchInstructors, updateInstructor} from "../repository/instructorRepository.js";
import { getAllInstructors } from "../repository/instructorRepository.js";
import { sendEmail } from "../utils/emailUtils.js";

export async function searchInstructorsService(keyword) {
    if (!keyword || keyword.length < 2) {
        return []
    }
    const instructors = await searchInstructors(keyword)
    return instructors
}

export async function getInstructorByIdService(id) {
    const instructor = await getInstructorById(id)
    return instructor
}

export async function getAllInstructorsService() {
    const instructors = await getAllInstructors()
    return instructors
}

export async function addInstructorService(data) {
    const result = await insertInstructor(data)
    const defaultPassword = "Temp@123";
    await sendEmail(data.email, "The credentials for your account", `Please using these credentials for login: ${data.email} - ${defaultPassword}`)
    return result
}

export async function updateInstructorService(instructorId, data) {
    await updateInstructor(instructorId, data)
    return {
        message: "Instructor updated successfully"
    }
}
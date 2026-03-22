import { searchInstructors} from "../repository/instructorRepository.js";

export async function searchInstructorsService(keyword) {
    if (!keyword || keyword.length < 2) {
        return []
    }
    const instructors = await searchInstructors(keyword)
    return instructors
}
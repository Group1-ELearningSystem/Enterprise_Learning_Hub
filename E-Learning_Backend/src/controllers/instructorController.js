import { searchInstructorsService } from "../services/instructorService.js"

export async function searchInstructorsController(req, res) {
    try {
        const keyword = req.query.q
        const instructors = await searchInstructorsService(keyword)
        res.json(instructors)
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: "Failed to search instructors" })
    }
}
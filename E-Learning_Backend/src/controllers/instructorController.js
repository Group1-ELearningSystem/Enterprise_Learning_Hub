import { searchInstructorsService, getAllInstructorsService, getInstructorByIdService, updateInstructorService, addInstructorService } from "../services/instructorService.js"

export async function searchInstructorsController(req, res) {
    try {
        const keyword = req.query.q
        const instructors = await searchInstructorsService(keyword)
        res.json(instructors)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to search instructors" })
    }
}

export async function getInstructorByIdController(req, res) {
    try {
        const id = req.params.id
        const instructor = await getInstructorByIdService(id)
        if (!instructor) {
            res.status(404).json({ message: "Instructor not found" })
        }
        res.status(200).json(instructor)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to fetch instructors" })
    }
}

export async function addInstructorController(req, res) {
    try{
        const data = {name: req.body.name, email: req.body.email, phone: req.body.phone}
        const result = await addInstructorService(data)
        res.status(201).json({ message: "Creating new instructor successfully", data: result})
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Failed to create new instructors" })
    }
}

export async function getAllInstructorController(req, res) {
    try {
        const instructors = await getAllInstructorsService()
        res.status(200).json(instructors)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to fetch instructors" })
    }
}

export async function updateInstructorController(req, res) {
    try{
        const id = req.params.id
        const { status } = req.body
        await updateInstructorService(id, status)
        res.json({
            success: true,
            message: "Instructor status updated"
        });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Failed to update instructors" })
    }
}
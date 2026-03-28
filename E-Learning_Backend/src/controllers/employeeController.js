import { addEmployeeService, getAllEmployeeService, getEmployeeByIdService, searchEmployeeService, updateEmployeeService } from "../services/employeeService.js"

export async function getAllEmployeeController(req, res) {
    try {
        const employees = await getAllEmployeeService()
        res.status(200).json(employees)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to fetch instructors" })
    }
}

export async function getEmployeeByIdController(req, res) {
    try {
        const id = req.params.id
        const employee = await getEmployeeByIdService(id)
        if (!employee) {
            res.status(404).json({ message: "Employee not found" })
        }
        res.status(200).json(employee)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to fetch employee" })
    }
}

export async function searchEmployeeController(req, res) {
    try {
        const keyword = req.query.q
        const employees = await searchEmployeeService(keyword)
        res.json(employees)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to search employees" })
    }
}

export async function addEmployeeController(req, res) {
    try{
        const data = {name: req.body.name, email: req.body.email, phone: req.body.phone, gender: req.body.gender, address: req.body.address, dob: req.body.dob}
        const result = await addEmployeeService(data)
        res.status(201).json({ message: "Creating new instructor successfully", data: result})
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Failed to create new instructors" })
    }
}

export async function updateEmployeeController(req, res) {
    try{
        const id = req.params.id
        const { status } = req.body
        await updateEmployeeService(id, status)
        res.json({
            success: true,
            message: "Employee status updated"
        });
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Failed to update employees" })
    }
}
import express from "express";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddlewares.js";
import { searchEmployeeController, getAllEmployeeController, addEmployeeController, updateEmployeeController, getEmployeeByIdController } from "../controllers/employeeController.js";

const router = express.Router()

router.get("/employees", verifyToken, authorizeRoles("Employee"), getAllEmployeeController)
router.get("/employees/search", verifyToken, authorizeRoles("Employee"), searchEmployeeController)
router.post("/employees", verifyToken, authorizeRoles("Employee"), addEmployeeController)
router.put("/employees/:id", verifyToken, authorizeRoles("Employee"), updateEmployeeController)
router.get("/employees/:id", verifyToken, authorizeRoles("Employee"), getEmployeeByIdController)

export default router
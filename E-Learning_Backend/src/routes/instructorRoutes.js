import express from "express";
import { addInstructorController, getAllInstructorController, getInstructorByIdController, searchInstructorsController, updateInstructorController } from "../controllers/instructorController.js";
import { authorizeRoles, verifyToken } from "../middlewares/authMiddlewares.js";
import { authPlugins } from "mysql2";
const router = express.Router()

router.get("/instructors", verifyToken, authorizeRoles("Employee"), getAllInstructorController)
router.get("/instructors/search", verifyToken, searchInstructorsController)
router.post("/instructors", verifyToken, authorizeRoles("Employee"), addInstructorController)
router.put("/instructor/:id", verifyToken, authorizeRoles("Employee"), updateInstructorController)
router.get("/instructors/:id", verifyToken, authorizeRoles("Employee"), getInstructorByIdController)

export default router
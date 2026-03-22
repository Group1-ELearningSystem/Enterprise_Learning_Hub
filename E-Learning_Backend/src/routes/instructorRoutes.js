import express from "express";
import { searchInstructorsController } from "../controllers/instructorController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.get("/instructors/search", verifyToken, searchInstructorsController)

export default router
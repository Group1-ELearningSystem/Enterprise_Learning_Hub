import express from "express";
import { loadAllFieldController } from "../controllers/fieldController.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
const router = express.Router()

router.get("/fields", verifyToken, loadAllFieldController)

export default router
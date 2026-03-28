import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddlewares.js";
import { getAllRequestsController, getRequestByIdController, updateRequestController } from "../controllers/requestController.js";
const router = express.Router()

router.get("/requests", verifyToken, authorizeRoles("Employee"), getAllRequestsController)
router.get("/requests/:id", verifyToken, authorizeRoles("Employee"), getRequestByIdController)
router.put("/requests/:id", verifyToken, authorizeRoles("Employee"), updateRequestController)
export default router

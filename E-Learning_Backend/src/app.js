import express from "express";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import fieldRoutes from "./routes/fieldRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import learnerCourseRoutes from "./routes/learnerCourseRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/templates", express.static("templates"));
app.use("/uploads", express.static("uploads"));

app.use("/api", accountRoutes);
app.use("/api", courseRoutes);
app.use("/api", sessionRoutes);
app.use("/api", exerciseRoutes);
app.use("/api", fieldRoutes);
app.use("/api", instructorRoutes);
app.use("/api", requestRoutes)
app.use("/api", employeeRoutes)

/**
 * Learner - Course routes
 */
app.use("/api/learner", learnerCourseRoutes);

export default app;
import express from "express";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes.js";
import courseRoutes from "./routes/courseRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"
import exerciseRoutes from "./routes/exerciseRoutes.js"

const app = express();

app.use(cors({ origin: '*' })); 
app.use(express.json());

app.use("/templates", express.static("templates"))
app.use("/api", accountRoutes);
app.use("/api", courseRoutes)
app.use("/api", sessionRoutes)
app.use("/uploads", express.static("uploads"))
app.use("/api", exerciseRoutes)

export default app;
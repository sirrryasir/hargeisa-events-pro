import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import apiRouter from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Logging for development

// API Routes
app.use("/api", apiRouter);

// Basic Welcome Route
app.get("/", (req, res) => {
  res.send("Hargeisa Events Pro API is running...");
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
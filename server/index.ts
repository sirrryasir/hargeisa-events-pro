import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
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
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api", limiter);

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
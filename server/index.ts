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
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP in dev to prevent 'Network Error' on cross-origin requests
}));
app.use(compression());
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Serve static uploads
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
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

import { createServer } from "http";
import { initSocket } from "./src/lib/socket.js";

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
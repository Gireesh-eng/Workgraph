import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { closeDriver } from "./db/driver";
import statsRouter from "./routes/stats";
import searchRouter from "./routes/search";
import entityRouter from "./routes/entity";
import pathRouter from "./routes/path";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

// CORS — allow the frontend origin (env var in production, localhost in dev)
const allowedOrigin = process.env.FRONTEND_URL ?? "http://localhost:5173";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Mount routes
app.use("/api/stats", statsRouter);
app.use("/api/search", searchRouter);
app.use("/api/entity", entityRouter);
app.use("/api/path", pathRouter);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

// Centralized error handling — must be registered after routes
app.use(errorHandler);

// Graceful shutdown
process.on("SIGINT", async () => {
    await closeDriver();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await closeDriver();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`WorkGraph API running on http://localhost:${PORT}`);
});

export default app;

import express from "express"
import cors from "cors"
import { logger } from "./utils/logger.js"
import simulationRoutes from "./routes/simulation.js"
import statusRoutes from "./routes/status.js"

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Routes
app.use("/api/simulation", simulationRoutes)
app.use("/api/status", statusRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err)
  res.status(500).json({ error: "Internal server error" })
})

export default app

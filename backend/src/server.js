import dotenv from "dotenv"
import { createServer } from "http"
import app from "./index.js"
import { initializeSocket } from "./services/socketService.js"
import { logger } from "./utils/logger.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const server = createServer(app)

// Initialize Socket.IO
initializeSocket(server)

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  server.close(() => {
    logger.info("Process terminated")
  })
})

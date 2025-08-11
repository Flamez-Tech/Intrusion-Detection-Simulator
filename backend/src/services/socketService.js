import { Server } from "socket.io"
import { logger } from "../utils/logger.js"

let io
let connectedClients = 0

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    connectedClients++
    logger.info(`Client connected. Total clients: ${connectedClients}`)

    socket.on("disconnect", () => {
      connectedClients--
      logger.info(`Client disconnected. Total clients: ${connectedClients}`)
    })

    // Send current status to new client
    socket.emit("status", {
      connected: true,
      timestamp: new Date().toISOString(),
    })
  })

  return io
}

export const socketService = {
  broadcast: (event, data) => {
    if (io) {
      io.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      })
    }
  },

  getConnectedClients: () => connectedClients,

  emit: (event, data) => {
    if (io) {
      io.emit(event, data)
    }
  },
}

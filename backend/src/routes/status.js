import express from "express"
import { SimulationService } from "../services/SimulationService.js"
import { socketService } from "../services/socketService.js"

const router = express.Router()
const simulationService = new SimulationService(socketService)

// Get current status
router.get("/", (req, res) => {
  try {
    const status = simulationService.getStatus()
    const connectedClients = socketService.getConnectedClients()

    res.json({
      success: true,
      ...status,
      connectedClients,
      serverTime: new Date().toISOString(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default router

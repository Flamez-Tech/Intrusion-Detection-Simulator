import express from "express"
import { SimulationService } from "../services/SimulationService.js"
import { socketService } from "../services/socketService.js"
import { logger } from "../utils/logger.js"

const router = express.Router()
const simulationService = new SimulationService(socketService)

// Start simulation
router.post("/start", (req, res) => {
  try {
    simulationService.start()
    res.json({
      success: true,
      message: "Simulation started",
      status: simulationService.getStatus(),
    })
  } catch (error) {
    logger.error("Failed to start simulation:", error.message)
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Stop simulation
router.post("/stop", (req, res) => {
  try {
    simulationService.stop()
    res.json({
      success: true,
      message: "Simulation stopped",
      status: simulationService.getStatus(),
    })
  } catch (error) {
    logger.error("Failed to stop simulation:", error.message)
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Set scenario
router.post("/scenario", (req, res) => {
  try {
    const { scenario } = req.body

    if (!scenario) {
      return res.status(400).json({
        success: false,
        error: "Scenario is required",
      })
    }

    simulationService.setScenario(scenario)
    res.json({
      success: true,
      message: `Scenario set to ${scenario}`,
      status: simulationService.getStatus(),
    })
  } catch (error) {
    logger.error("Failed to set scenario:", error.message)
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Update threshold
router.post("/threshold", (req, res) => {
  try {
    const { threshold } = req.body

    if (typeof threshold !== "number" || threshold <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid threshold is required",
      })
    }

    simulationService.updateThreshold(threshold)
    res.json({
      success: true,
      message: `Threshold updated to ${threshold}`,
      status: simulationService.getStatus(),
    })
  } catch (error) {
    logger.error("Failed to update threshold:", error.message)
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

// Get available scenarios
router.get("/scenarios", (req, res) => {
  try {
    const scenarios = simulationService.getAvailableScenarios()
    res.json({
      success: true,
      scenarios,
    })
  } catch (error) {
    logger.error("Failed to get scenarios:", error.message)
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

export default router

import { NetworkSimulator } from "../simulators/NetworkSimulator.js"
import { AnomalyDetector } from "../models/AnomalyDetector.js"
import { ATTACK_SCENARIOS, DEFAULT_THRESHOLDS } from "../config/scenarios.js"
import { logger } from "../utils/logger.js"

export class SimulationService {
  constructor(socketService) {
    this.socketService = socketService
    this.simulator = new NetworkSimulator(ATTACK_SCENARIOS.normal)
    this.detector = new AnomalyDetector(DEFAULT_THRESHOLDS.anomalyScore)
    this.currentScenario = "normal"
    this.stats = {
      totalEvents: 0,
      totalAnomalies: 0,
      startTime: null,
    }
  }

  start() {
    if (this.simulator.isRunning) {
      throw new Error("Simulation is already running")
    }

    this.stats.startTime = new Date()
    this.stats.totalEvents = 0
    this.stats.totalAnomalies = 0

    this.simulator.start((event) => {
      this.handleEvent(event)
    })

    this.socketService.broadcast("status", {
      isRunning: true,
      scenario: this.currentScenario,
      startTime: this.stats.startTime,
    })

    logger.info("Simulation started")
  }

  stop() {
    if (!this.simulator.isRunning) {
      throw new Error("Simulation is not running")
    }

    this.simulator.stop()

    this.socketService.broadcast("status", {
      isRunning: false,
      scenario: this.currentScenario,
      stats: this.getStats(),
    })

    logger.info("Simulation stopped")
  }

  handleEvent(event) {
    this.stats.totalEvents++

    // Detect anomalies
    const detection = this.detector.addEvent(event)

    if (detection.isAnomaly) {
      this.stats.totalAnomalies++

      // Broadcast alert
      this.socketService.broadcast("alert", {
        id: event.id,
        timestamp: event.timestamp,
        severity: detection.severity,
        score: detection.score,
        event: event,
        message: `Anomaly detected: ${event.type} from ${event.sourceIP}`,
      })
    }

    // Broadcast event
    this.socketService.broadcast("event", {
      ...event,
      anomalyScore: detection.score,
      isAnomaly: detection.isAnomaly,
    })
  }

  setScenario(scenarioName) {
    if (!ATTACK_SCENARIOS[scenarioName]) {
      throw new Error(`Unknown scenario: ${scenarioName}`)
    }

    this.currentScenario = scenarioName
    this.simulator.updateScenario(ATTACK_SCENARIOS[scenarioName])

    this.socketService.broadcast("status", {
      scenario: scenarioName,
      isRunning: this.simulator.isRunning,
    })

    logger.info(`Scenario changed to: ${scenarioName}`)
  }

  updateThreshold(threshold) {
    this.detector.updateThreshold(threshold)

    this.socketService.broadcast("status", {
      threshold: threshold,
    })
  }

  getStatus() {
    return {
      isRunning: this.simulator.isRunning,
      scenario: this.currentScenario,
      threshold: this.detector.threshold,
      stats: this.getStats(),
      detectorStats: this.detector.getStats(),
    }
  }

  getStats() {
    const runtime = this.stats.startTime ? (new Date() - this.stats.startTime) / 1000 : 0

    return {
      ...this.stats,
      runtime,
      eventsPerSecond: runtime > 0 ? this.stats.totalEvents / runtime : 0,
      anomalyRate: this.stats.totalEvents > 0 ? this.stats.totalAnomalies / this.stats.totalEvents : 0,
    }
  }

  getAvailableScenarios() {
    return Object.keys(ATTACK_SCENARIOS).map((key) => ({
      id: key,
      ...ATTACK_SCENARIOS[key],
    }))
  }
}

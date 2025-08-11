import { calculateZScore } from "../utils/helpers.js"
import { logger } from "../utils/logger.js"

export class AnomalyDetector {
  constructor(threshold = 2.5, windowSize = 100) {
    this.threshold = threshold
    this.windowSize = windowSize
    this.eventHistory = []
    this.stats = {
      mean: 0,
      stdDev: 1,
      count: 0,
    }
  }

  addEvent(event) {
    this.eventHistory.push(event)

    // Keep only recent events
    if (this.eventHistory.length > this.windowSize) {
      this.eventHistory.shift()
    }

    this.updateStats()
    return this.detectAnomaly(event)
  }

  updateStats() {
    if (this.eventHistory.length === 0) return

    // Calculate mean
    const values = this.eventHistory.map((e) => e.value || 1)
    this.stats.mean = values.reduce((sum, val) => sum + val, 0) / values.length

    // Calculate standard deviation
    const variance =
      values.reduce((sum, val) => {
        return sum + Math.pow(val - this.stats.mean, 2)
      }, 0) / values.length

    this.stats.stdDev = Math.sqrt(variance) || 1
    this.stats.count = this.eventHistory.length
  }

  detectAnomaly(event) {
    const value = event.value || 1
    const zScore = calculateZScore(value, this.stats.mean, this.stats.stdDev)
    const isAnomaly = Math.abs(zScore) > this.threshold

    const result = {
      isAnomaly,
      score: Math.abs(zScore),
      threshold: this.threshold,
      severity: this.calculateSeverity(Math.abs(zScore)),
      event,
    }

    if (isAnomaly) {
      logger.warn("Anomaly detected:", {
        eventId: event.id,
        score: result.score,
        severity: result.severity,
      })
    }

    return result
  }

  calculateSeverity(score) {
    if (score > 4) return "critical"
    if (score > 3) return "high"
    if (score > 2.5) return "medium"
    return "low"
  }

  updateThreshold(newThreshold) {
    this.threshold = newThreshold
    logger.info(`Anomaly detection threshold updated to ${newThreshold}`)
  }

  getStats() {
    return {
      ...this.stats,
      threshold: this.threshold,
      windowSize: this.windowSize,
      historyLength: this.eventHistory.length,
    }
  }
}

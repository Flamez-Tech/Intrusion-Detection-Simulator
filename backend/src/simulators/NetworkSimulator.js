import {
  generateRandomIP,
  generateRandomPort,
  generateEventId,
  getRandomElement,
  generateNormalDistribution,
} from "../utils/helpers.js"
import { EVENT_TYPES } from "../config/eventTypes.js"
import { logger } from "../utils/logger.js"

export class NetworkSimulator {
  constructor(scenario) {
    this.scenario = scenario
    this.isRunning = false
    this.intervalId = null
    this.eventCount = 0
  }

  start(onEvent) {
    if (this.isRunning) {
      logger.warn("Simulator is already running")
      return
    }

    this.isRunning = true
    this.eventCount = 0

    const interval = 1000 / (this.scenario.eventRate / 60) // Convert events per minute to milliseconds

    this.intervalId = setInterval(() => {
      const event = this.generateEvent()
      onEvent(event)
      this.eventCount++
    }, interval)

    logger.info(`Network simulator started with scenario: ${this.scenario.name}`)
  }

  stop() {
    if (!this.isRunning) {
      logger.warn("Simulator is not running")
      return
    }

    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    logger.info(`Network simulator stopped. Generated ${this.eventCount} events`)
  }

  generateEvent() {
    const eventType = this.selectEventType()
    const isAnomalous = Math.random() < this.scenario.anomalyRate

    const baseEvent = {
      id: generateEventId(),
      timestamp: new Date().toISOString(),
      type: eventType,
      sourceIP: generateRandomIP(),
      destinationIP: generateRandomIP(),
      sourcePort: generateRandomPort(),
      destinationPort: generateRandomPort(),
      isAnomalous,
    }

    // Add event-specific data and anomaly characteristics
    return this.enrichEvent(baseEvent, eventType, isAnomalous)
  }

  selectEventType() {
    const rand = Math.random()
    const patterns = this.scenario.patterns

    if (rand < patterns.ddos) {
      return getRandomElement([
        EVENT_TYPES.HTTP_REQUEST,
        EVENT_TYPES.NETWORK_CONNECTION,
        EVENT_TYPES.SUSPICIOUS_TRAFFIC,
      ])
    } else if (rand < patterns.ddos + patterns.bruteforce) {
      return getRandomElement([EVENT_TYPES.LOGIN_ATTEMPT, EVENT_TYPES.PORT_SCAN])
    } else if (rand < patterns.ddos + patterns.bruteforce + patterns.malware) {
      return getRandomElement([EVENT_TYPES.MALWARE_DETECTION, EVENT_TYPES.DNS_QUERY, EVENT_TYPES.FILE_ACCESS])
    }

    return getRandomElement(Object.values(EVENT_TYPES))
  }

  enrichEvent(event, eventType, isAnomalous) {
    // Base value for anomaly detection
    let value = generateNormalDistribution(50, 15)

    if (isAnomalous) {
      value += generateNormalDistribution(100, 30) // Add anomalous spike
    }

    event.value = Math.max(0, value)

    // Add event-specific enrichment
    switch (eventType) {
      case EVENT_TYPES.HTTP_REQUEST:
        event.method = getRandomElement(["GET", "POST", "PUT", "DELETE"])
        event.statusCode = isAnomalous ? getRandomElement([404, 500, 403]) : getRandomElement([200, 201, 304])
        event.userAgent = isAnomalous ? "Suspicious-Bot/1.0" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        break

      case EVENT_TYPES.LOGIN_ATTEMPT:
        event.username = isAnomalous
          ? getRandomElement(["admin", "root", "administrator"])
          : `user${Math.floor(Math.random() * 1000)}`
        event.success = isAnomalous ? false : Math.random() > 0.1
        break

      case EVENT_TYPES.PORT_SCAN:
        event.portsScanned = isAnomalous ? Math.floor(Math.random() * 1000) + 100 : Math.floor(Math.random() * 10) + 1
        break

      case EVENT_TYPES.MALWARE_DETECTION:
        event.signature = isAnomalous ? "Trojan.Generic.Suspicious" : "PUA.Adware.Minor"
        event.severity = isAnomalous ? "high" : "low"
        break

      default:
        event.bytes = Math.floor(Math.random() * 10000)
    }

    return event
  }

  updateScenario(newScenario) {
    const wasRunning = this.isRunning

    if (wasRunning) {
      this.stop()
    }

    this.scenario = newScenario
    logger.info(`Scenario updated to: ${newScenario.name}`)

    if (wasRunning) {
      // Restart with new scenario
      setTimeout(() => this.start(), 100)
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      scenario: this.scenario.name,
      eventCount: this.eventCount,
      eventRate: this.scenario.eventRate,
    }
  }
}

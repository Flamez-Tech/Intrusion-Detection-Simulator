"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { socketClient } from "../lib/socket"
import { apiClient } from "../lib/api"

const SimulationContext = createContext()

const initialState = {
  isRunning: false,
  scenario: "normal",
  threshold: 2.5,
  events: [],
  alerts: [],
  stats: {
    totalEvents: 0,
    totalAnomalies: 0,
    eventsPerSecond: 0,
    anomalyRate: 0,
  },
  connectedClients: 0,
  isConnected: false,
  scenarios: [],
}

function simulationReducer(state, action) {
  switch (action.type) {
    case "SET_CONNECTION_STATUS":
      return { ...state, isConnected: action.payload }

    case "SET_STATUS":
      return {
        ...state,
        ...action.payload,
        stats: { ...state.stats, ...action.payload.stats },
      }

    case "ADD_EVENT":
      return {
        ...state,
        events: [action.payload, ...state.events.slice(0, 99)], // Keep last 100 events
        stats: {
          ...state.stats,
          totalEvents: state.stats.totalEvents + 1,
        },
      }

    case "ADD_ALERT":
      return {
        ...state,
        alerts: [action.payload, ...state.alerts.slice(0, 49)], // Keep last 50 alerts
        stats: {
          ...state.stats,
          totalAnomalies: state.stats.totalAnomalies + 1,
        },
      }

    case "SET_SCENARIOS":
      return { ...state, scenarios: action.payload }

    case "CLEAR_EVENTS":
      return { ...state, events: [] }

    case "CLEAR_ALERTS":
      return { ...state, alerts: [] }

    default:
      return state
  }
}

export function SimulationProvider({ children }) {
  const [state, dispatch] = useReducer(simulationReducer, initialState)

  useEffect(() => {
    // Connect to socket
    socketClient.connect()

    // Set up event listeners
    socketClient.on("connect", () => {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: true })
    })

    socketClient.on("disconnect", () => {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: false })
    })

    socketClient.on("status", (data) => {
      dispatch({ type: "SET_STATUS", payload: data })
    })

    socketClient.on("event", (data) => {
      dispatch({ type: "ADD_EVENT", payload: data })
    })

    socketClient.on("alert", (data) => {
      dispatch({ type: "ADD_ALERT", payload: data })
    })

    // Load initial data
    loadScenarios()
    loadStatus()

    return () => {
      socketClient.disconnect()
    }
  }, [])

  const loadScenarios = async () => {
    try {
      const response = await apiClient.getScenarios()
      dispatch({ type: "SET_SCENARIOS", payload: response.scenarios })
    } catch (error) {
      console.error("Failed to load scenarios:", error)
    }
  }

  const loadStatus = async () => {
    try {
      const response = await apiClient.getStatus()
      dispatch({ type: "SET_STATUS", payload: response })
    } catch (error) {
      console.error("Failed to load status:", error)
    }
  }

  const startSimulation = async () => {
    try {
      await apiClient.startSimulation()
    } catch (error) {
      console.error("Failed to start simulation:", error)
      throw error
    }
  }

  const stopSimulation = async () => {
    try {
      await apiClient.stopSimulation()
    } catch (error) {
      console.error("Failed to stop simulation:", error)
      throw error
    }
  }

  const setScenario = async (scenario) => {
    try {
      await apiClient.setScenario(scenario)
    } catch (error) {
      console.error("Failed to set scenario:", error)
      throw error
    }
  }

  const updateThreshold = async (threshold) => {
    try {
      await apiClient.updateThreshold(threshold)
    } catch (error) {
      console.error("Failed to update threshold:", error)
      throw error
    }
  }

  const clearEvents = () => {
    dispatch({ type: "CLEAR_EVENTS" })
  }

  const clearAlerts = () => {
    dispatch({ type: "CLEAR_ALERTS" })
  }

  const value = {
    ...state,
    startSimulation,
    stopSimulation,
    setScenario,
    updateThreshold,
    clearEvents,
    clearAlerts,
  }

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>
}

export function useSimulation() {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider")
  }
  return context
}

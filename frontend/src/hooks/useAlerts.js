"use client"

import { useState, useEffect } from "react"
import { socketClient } from "../lib/socket"

export function useAlerts() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const handleAlert = (alert) => {
      setAlerts((prev) => [alert, ...prev.slice(0, 49)]) // Keep last 50 alerts
    }

    socketClient.on("alert", handleAlert)

    return () => {
      socketClient.off("alert", handleAlert)
    }
  }, [])

  const clearAlerts = () => setAlerts([])

  return {
    alerts,
    clearAlerts,
  }
}

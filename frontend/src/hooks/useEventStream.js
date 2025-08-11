"use client"

import { useState, useEffect } from "react"
import { socketClient } from "../lib/socket"

export function useEventStream() {
  const [events, setEvents] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const handleConnect = () => setIsConnected(true)
    const handleDisconnect = () => setIsConnected(false)

    const handleEvent = (event) => {
      setEvents((prev) => [event, ...prev.slice(0, 99)]) // Keep last 100 events
    }

    socketClient.on("connect", handleConnect)
    socketClient.on("disconnect", handleDisconnect)
    socketClient.on("event", handleEvent)

    return () => {
      socketClient.off("connect", handleConnect)
      socketClient.off("disconnect", handleDisconnect)
      socketClient.off("event", handleEvent)
    }
  }, [])

  const clearEvents = () => setEvents([])

  return {
    events,
    isConnected,
    clearEvents,
  }
}

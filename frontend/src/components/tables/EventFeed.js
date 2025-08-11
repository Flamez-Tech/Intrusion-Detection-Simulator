"use client"

import { useState } from "react"
import { Trash2, Filter } from "lucide-react"
import { useSimulation } from "../../context/SimulationContext"
import { formatTimestamp } from "../../lib/utils"

export function EventFeed() {
  const { events, clearEvents } = useSimulation()
  const [filter, setFilter] = useState("all")

  const filteredEvents = events.filter((event) => {
    if (filter === "anomalies") return event.isAnomaly
    if (filter === "normal") return !event.isAnomaly
    return true
  })

  const getEventTypeColor = (type) => {
    const colors = {
      http_request: "text-blue-400",
      login_attempt: "text-green-400",
      port_scan: "text-red-400",
      malware_detection: "text-purple-400",
      suspicious_traffic: "text-orange-400",
      network_connection: "text-cyan-400",
      dns_query: "text-yellow-400",
      file_access: "text-pink-400",
    }
    return colors[type] || "text-gray-400"
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Live Event Feed</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Filter className="h-4 w-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-2 py-1 bg-background border border-border rounded text-sm"
            >
              <option value="all">All Events</option>
              <option value="anomalies">Anomalies Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>
          <button
            onClick={clearEvents}
            className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card border-b border-border">
              <tr>
                <th className="text-left py-2 px-3">Time</th>
                <th className="text-left py-2 px-3">Type</th>
                <th className="text-left py-2 px-3">Source IP</th>
                <th className="text-left py-2 px-3">Score</th>
                <th className="text-left py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted-foreground">
                    No events to display
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className={`border-b border-border/50 hover:bg-muted/50 ${event.isAnomaly ? "bg-red-500/5" : ""}`}
                  >
                    <td className="py-2 px-3 font-mono text-xs">{formatTimestamp(event.timestamp)}</td>
                    <td className={`py-2 px-3 ${getEventTypeColor(event.type)}`}>{event.type.replace("_", " ")}</td>
                    <td className="py-2 px-3 font-mono">{event.sourceIP}</td>
                    <td className="py-2 px-3 font-mono">{event.anomalyScore?.toFixed(2) || "0.00"}</td>
                    <td className="py-2 px-3">
                      {event.isAnomaly ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          Anomaly
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        Showing {filteredEvents.length} of {events.length} events
      </div>
    </div>
  )
}

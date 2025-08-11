"use client"

import { useState } from "react"
import { AlertTriangle, Trash2, X } from "lucide-react"
import { useSimulation } from "../../context/SimulationContext"
import { formatTimestamp, getSeverityColor } from "../../lib/utils"

export function AlertPanel() {
  const { alerts, clearAlerts } = useSimulation()
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.id))

  const dismissAlert = (alertId) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]))
  }

  const getSeverityIcon = (severity) => {
    return <AlertTriangle className="h-4 w-4" />
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold">Security Alerts</h2>
          {visibleAlerts.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
              {visibleAlerts.length}
            </span>
          )}
        </div>
        <button
          onClick={clearAlerts}
          className="flex items-center space-x-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {visibleAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium uppercase ${getSeverityColor(alert.severity)}`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTimestamp(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{alert.message}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Event Type: {alert.event.type.replace("_", " ")}</div>
                      <div>
                        Source: {alert.event.sourceIP}:{alert.event.sourcePort}
                      </div>
                      <div>Anomaly Score: {alert.score.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import { useSimulation } from "../../context/SimulationContext"

export function IntensityGauge() {
  const { stats, threshold } = useSimulation()

  // Calculate intensity based on anomaly rate and events per second
  const intensity = Math.min((stats.anomalyRate * 100 + stats.eventsPerSecond / 10) / 2, 100)

  const getIntensityColor = (value) => {
    if (value > 75) return "bg-red-500"
    if (value > 50) return "bg-orange-500"
    if (value > 25) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getIntensityLabel = (value) => {
    if (value > 75) return "Critical"
    if (value > 50) return "High"
    if (value > 25) return "Medium"
    return "Low"
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Threat Intensity</h2>

      <div className="space-y-4">
        {/* Gauge */}
        <div className="relative">
          <div className="w-full bg-muted rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getIntensityColor(intensity)}`}
              style={{ width: `${intensity}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Intensity Value */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">{intensity.toFixed(1)}%</div>
          <div
            className={`text-sm font-medium ${
              intensity > 75
                ? "text-red-500"
                : intensity > 50
                  ? "text-orange-500"
                  : intensity > 25
                    ? "text-yellow-500"
                    : "text-green-500"
            }`}
          >
            {getIntensityLabel(intensity)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-muted-foreground">Anomaly Rate</div>
            <div className="font-mono font-medium">{(stats.anomalyRate * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Events/sec</div>
            <div className="font-mono font-medium">{stats.eventsPerSecond.toFixed(1)}</div>
          </div>
        </div>

        {/* Threshold Indicator */}
        <div className="text-xs text-muted-foreground text-center">Detection threshold: {threshold}</div>
      </div>
    </div>
  )
}

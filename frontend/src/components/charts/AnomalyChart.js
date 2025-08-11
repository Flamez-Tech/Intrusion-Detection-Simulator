import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSimulation } from "../../context/SimulationContext"
import { formatTimestamp } from "../../lib/utils"

export function AnomalyChart() {
  const { events } = useSimulation()

  // Prepare data for chart (last 50 events)
  const chartData = events
    .slice(0, 50)
    .reverse()
    .map((event, index) => ({
      index,
      score: event.anomalyScore || 0,
      timestamp: event.timestamp,
      isAnomaly: event.isAnomaly,
    }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">Time: {formatTimestamp(data.timestamp)}</p>
          <p className="text-sm">
            Score: <span className="font-mono">{data.score.toFixed(2)}</span>
          </p>
          {data.isAnomaly && <p className="text-sm text-red-400">⚠️ Anomaly Detected</p>}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Anomaly Score Timeline</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="index" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props
                return payload.isAnomaly ? (
                  <circle cx={cx} cy={cy} r={4} fill="#ef4444" stroke="#ef4444" strokeWidth={2} />
                ) : (
                  <circle cx={cx} cy={cy} r={2} fill="hsl(var(--primary))" stroke="hsl(var(--primary))" />
                )
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <span>Showing last 50 events</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Anomaly</span>
          </div>
        </div>
      </div>
    </div>
  )
}

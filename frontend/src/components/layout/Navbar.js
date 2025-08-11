import { Activity, Wifi, WifiOff } from "lucide-react"
import { useSimulation } from "../../context/SimulationContext"
import { DarkModeToggle } from "./DarkModeToggle";

export function Navbar() {
  const { isConnected, stats } = useSimulation()

  return (
    <nav className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Intrusion Detection Simulator</h1>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Events:</span>
            <span className="font-mono">
              {stats.totalEvents.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Anomalies:</span>
            <span className="font-mono text-red-400">
              {stats.totalAnomalies.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">Disconnected</span>
              </>
            )}
          </div>

          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
}

import { Navbar } from "../components/layout/Navbar"
import { SimulationControls } from "../components/controls/SimulationControls"
import { AnomalyChart } from "../components/charts/AnomalyChart"
import { IntensityGauge } from "../components/charts/IntensityGauge"
import { EventFeed } from "../components/tables/EventFeed"
import { AlertPanel } from "../components/tables/AlertPanel"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <SimulationControls />
          </div>

          {/* Charts */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <AnomalyChart />
              </div>
              <div className="xl:col-span-1">
                <IntensityGauge />
              </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <EventFeed />
              <AlertPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

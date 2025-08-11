"use client"

import { useState } from "react"
import { Play, Pause, Settings } from "lucide-react"
import { useSimulation } from "../../context/SimulationContext"

export function SimulationControls() {
  const { isRunning, scenario, threshold, scenarios, startSimulation, stopSimulation, setScenario, updateThreshold } =
    useSimulation()

  const [localThreshold, setLocalThreshold] = useState(threshold)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleSimulation = async () => {
    setIsLoading(true)
    try {
      if (isRunning) {
        await stopSimulation()
      } else {
        await startSimulation()
      }
    } catch (error) {
      console.error("Failed to toggle simulation:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScenarioChange = async (newScenario) => {
    try {
      await setScenario(newScenario)
    } catch (error) {
      console.error("Failed to change scenario:", error)
    }
  }

  const handleThresholdChange = async (newThreshold) => {
    setLocalThreshold(newThreshold)
    try {
      await updateThreshold(Number.parseFloat(newThreshold))
    } catch (error) {
      console.error("Failed to update threshold:", error)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Simulation Controls</h2>
      </div>

      <div className="space-y-4">
        {/* Start/Stop Button */}
        <div>
          <button
            onClick={handleToggleSimulation}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 hover:cursor-pointer py-2 rounded-md font-medium transition-colors ${
              isRunning ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isLoading ? "Loading..." : isRunning ? "Stop" : "Start"}</span>
          </button>
        </div>

        {/* Scenario Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Attack Scenario</label>
          <select
            value={scenario}
            onChange={(e) => handleScenarioChange(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 hover:cursor-pointer focus:ring-primary"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {scenarios.find((s) => s.id === scenario) && (
            <p className="text-sm text-muted-foreground mt-1">{scenarios.find((s) => s.id === scenario).description}</p>
          )}
        </div>

        {/* Threshold Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">Detection Threshold: {localThreshold}</label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={localThreshold}
            onChange={(e) => handleThresholdChange(e.target.value)}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Less Sensitive</span>
            <span>More Sensitive</span>
          </div>
        </div>
      </div>
    </div>
  )
}

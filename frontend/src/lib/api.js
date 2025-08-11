const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Simulation endpoints
  async startSimulation() {
    return this.request("/api/simulation/start", { method: "POST" })
  }

  async stopSimulation() {
    return this.request("/api/simulation/stop", { method: "POST" })
  }

  async setScenario(scenario) {
    return this.request("/api/simulation/scenario", {
      method: "POST",
      body: { scenario },
    })
  }

  async updateThreshold(threshold) {
    return this.request("/api/simulation/threshold", {
      method: "POST",
      body: { threshold },
    })
  }

  async getScenarios() {
    return this.request("/api/simulation/scenarios")
  }

  async getStatus() {
    return this.request("/api/status")
  }
}

export const apiClient = new ApiClient()

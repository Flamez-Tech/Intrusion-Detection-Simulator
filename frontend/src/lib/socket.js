import { io } from "socket.io-client"

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:5000"

class SocketClient {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(WS_URL, {
      transports: ["websocket", "polling"],
    })

    this.socket.on("connect", () => {
      console.log("Connected to server")
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server")
    })

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event, callback) {
    if (!this.socket) {
      this.connect()
    }

    this.socket.on(event, callback)

    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }

    // Remove from stored listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

export const socketClient = new SocketClient()

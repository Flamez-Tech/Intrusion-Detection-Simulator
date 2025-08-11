import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleTimeString()
}

export function formatNumber(num) {
  return new Intl.NumberFormat().format(num)
}

export function getSeverityColor(severity) {
  switch (severity) {
    case "critical":
      return "text-red-500 bg-red-500/10 border-red-500/20"
    case "high":
      return "text-orange-500 bg-orange-500/10 border-orange-500/20"
    case "medium":
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    case "low":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20"
    default:
      return "text-gray-500 bg-gray-500/10 border-gray-500/20"
  }
}

import { v4 as uuidv4 } from "uuid"

export function generateRandomIP() {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

export function generateRandomPort() {
  return Math.floor(Math.random() * 65535) + 1
}

export function generateEventId() {
  return uuidv4()
}

export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function generateNormalDistribution(mean = 0, stdDev = 1) {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()

  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdDev + mean
}

export function calculateZScore(value, mean, stdDev) {
  if (stdDev === 0) return 0
  return (value - mean) / stdDev
}

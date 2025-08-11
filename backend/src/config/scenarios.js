export const ATTACK_SCENARIOS = {
  normal: {
    name: "Normal Traffic",
    description: "Regular network activity",
    anomalyRate: 0.02,
    eventRate: 50,
    patterns: {
      ddos: 0.01,
      bruteforce: 0.005,
      malware: 0.005,
    },
  },
  ddos: {
    name: "DDoS Attack",
    description: "Distributed Denial of Service attack simulation",
    anomalyRate: 0.3,
    eventRate: 200,
    patterns: {
      ddos: 0.8,
      bruteforce: 0.1,
      malware: 0.1,
    },
  },
  bruteforce: {
    name: "Brute Force Attack",
    description: "Login brute force attack simulation",
    anomalyRate: 0.25,
    eventRate: 100,
    patterns: {
      ddos: 0.1,
      bruteforce: 0.7,
      malware: 0.2,
    },
  },
  malware: {
    name: "Malware Activity",
    description: "Malware communication simulation",
    anomalyRate: 0.4,
    eventRate: 80,
    patterns: {
      ddos: 0.1,
      bruteforce: 0.2,
      malware: 0.7,
    },
  },
}

export const DEFAULT_THRESHOLDS = {
  anomalyScore: 2.5,
  eventRate: 100,
  sensitivity: 0.8,
}

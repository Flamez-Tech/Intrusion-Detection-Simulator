# Intrusion Detection Simulator

A real-time network intrusion detection simulator with anomaly detection capabilities.

## Project Structure

\`\`\`
intrusion-detector-simulator/
├── backend/          # Node.js + Express + Socket.IO server
├── frontend/         # Next.js 14 dashboard
├── package.json      # Root package.json with scripts
└── README.md         # This file
\`\`\`

## Features

### Backend
- Real-time network activity simulation
- Z-score based anomaly detection
- REST API for simulation control
- WebSocket streaming of events and alerts
- Multiple attack scenarios
- Configurable detection thresholds

### Frontend
- Real-time dashboard with live event feed
- Anomaly score charts and gauges
- Simulation controls
- Attack scenario selection
- Responsive dark-mode design

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm run install:all
   \`\`\`

2. **Start development servers:**
   \`\`\`bash
   npm run dev:all
   \`\`\`

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Individual Commands

- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only
- `npm run dev:all` - Start both servers concurrently

## Environment Variables

### Backend (.env)
\`\`\`
PORT=5000
NODE_ENV=development
LOG_LEVEL=info
\`\`\`

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
\`\`\`

## API Endpoints

- `GET /api/status` - Get simulation status
- `POST /api/simulation/start` - Start simulation
- `POST /api/simulation/stop` - Stop simulation
- `POST /api/scenario` - Set attack scenario
- `POST /api/threshold` - Update detection threshold

## WebSocket Events

- `event` - New network event
- `alert` - Anomaly alert
- `status` - Simulation status update
# Intrusion-Detection-Simulator

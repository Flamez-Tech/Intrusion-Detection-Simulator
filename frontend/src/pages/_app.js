import "../styles/globals.css"
import { SimulationProvider } from "../context/SimulationContext"

export default function App({ Component, pageProps }) {
  return (
    <SimulationProvider>
      <Component {...pageProps} />
    </SimulationProvider>
  )
}

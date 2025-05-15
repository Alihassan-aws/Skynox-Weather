import { WeatherDashboard } from "@/components/weather-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden transition-colors duration-500">
      <WeatherDashboard />
    </main>
  )
}

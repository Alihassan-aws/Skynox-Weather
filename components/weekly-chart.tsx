"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ForecastData } from "@/lib/types"
import { getWeatherEmoji, formatDate, formatTemperature } from "@/lib/utils"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend)

interface WeeklyChartProps {
  forecast: ForecastData
  unit: "metric" | "imperial"
}

export function WeeklyChart({ forecast, unit }: WeeklyChartProps) {
  // Group forecast by day
  const dailyForecasts = forecast.list.reduce(
    (acc, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(item)
      return acc
    },
    {} as Record<string, typeof forecast.list>,
  )

  // Get one forecast per day (noon when available)
  const dailyData = Object.entries(dailyForecasts)
    .map(([date, items]) => {
      // Try to get forecast for around noon
      const noonForecast = items.find((item) => {
        const hour = new Date(item.dt * 1000).getHours()
        return hour >= 11 && hour <= 13
      })

      return noonForecast || items[0] // Fallback to first item if noon not available
    })
    .slice(0, 7) // Limit to 7 days

  // Prepare chart data
  const chartData = {
    labels: dailyData.map((day, index) => {
      const date = new Date(day.dt * 1000)
      return index === 0 ? "Today" : formatDate(date, "short")
    }),
    datasets: [
      {
        label: "Max Temperature",
        data: dailyData.map((day) => day.main.temp_max),
        backgroundColor: "rgba(139, 92, 246, 0.8)", // violet-500
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Min Temperature",
        data: dailyData.map((day) => day.main.temp_min),
        backgroundColor: "rgba(59, 130, 246, 0.8)", // blue-500
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: "linear" as const,
        beginAtZero: false,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          callback: (value: any) => `${value}°${unit === "metric" ? "C" : "F"}`,
        },
      },
      x: {
        type: "category" as const,
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.9)",
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatTemperature(context.raw, unit)}`,
        },
      },
    },
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-none bg-slate-800/40 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-white">7-Day Temperature Forecast</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mt-6">
            {dailyData.map((day, index) => {
              const date = new Date(day.dt * 1000)
              const emoji = getWeatherEmoji(day.weather[0].id)

              return (
                <motion.div
                  key={day.dt}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-slate-700/60 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-600/30"
                  whileHover={{
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                >
                  <p className="text-sm font-medium text-white mb-1">
                    {index === 0 ? "Today" : formatDate(date, "short")}
                  </p>
                  <div className="text-2xl my-2">{emoji}</div>
                  <p className="text-xs capitalize text-slate-300 mb-2">{day.weather[0].description}</p>

                  <div className="flex justify-between items-center text-xs px-1">
                    <span className="text-blue-300">{formatTemperature(day.main.temp_min, unit, false)}</span>
                    <div className="h-1 flex-1 mx-1 rounded-full bg-gradient-to-r from-blue-400 to-violet-500"></div>
                    <span className="text-violet-300">{formatTemperature(day.main.temp_max, unit, false)}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

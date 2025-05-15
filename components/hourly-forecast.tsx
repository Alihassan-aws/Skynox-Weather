"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ForecastData } from "@/lib/types"
import { getWeatherEmoji, formatTemperature } from "@/lib/utils"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend, Filler)

interface HourlyForecastProps {
  forecast: ForecastData
  unit: "metric" | "imperial"
}

export function HourlyForecast({ forecast, unit }: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Get the next 24 hours of forecast data
  const hourlyData = forecast.list.slice(0, 8)

  // Check scroll position
  const checkScroll = () => {
    if (!scrollRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  // Add scroll event listener
  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll)
      checkScroll()
      return () => scrollElement.removeEventListener("scroll", checkScroll)
    }
  }, [forecast])

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  // Prepare chart data
  const chartData = {
    labels: hourlyData.map((item) => {
      const date = new Date(item.dt * 1000)
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }),
    datasets: [
      {
        label: "Temperature",
        data: hourlyData.map((item) => item.main.temp),
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(99, 102, 241, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
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
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        titleColor: "rgba(255, 255, 255, 0.9)",
        bodyColor: "rgba(255, 255, 255, 0.9)",
        displayColors: false,
        callbacks: {
          label: (context: any) => `${formatTemperature(context.raw, unit)}`,
        },
      },
    },
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-none bg-slate-800/40 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-white">24-Hour Forecast</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Chart Section */}
          <div className="h-64 mb-6">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Hourly Cards Section */}
          <div className="relative">
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-700/80 hover:bg-slate-600/80 rounded-full p-2 text-white shadow-lg transition-all"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-700/80 hover:bg-slate-600/80 rounded-full p-2 text-white shadow-lg transition-all"
              >
                <ChevronRight size={20} />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {hourlyData.map((hour, index) => {
                const date = new Date(hour.dt * 1000)
                const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                const emoji = getWeatherEmoji(hour.weather[0].id)

                return (
                  <motion.div
                    key={hour.dt}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex-shrink-0 w-32 bg-slate-700/60 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-600/30"
                    whileHover={{
                      scale: 1.05,
                      transition: { type: "spring", stiffness: 400, damping: 10 },
                    }}
                  >
                    <p className="text-sm font-medium text-white mb-2">{time}</p>
                    <div className="text-3xl mb-2">{emoji}</div>
                    <p className="text-lg font-bold text-white">{formatTemperature(hour.main.temp, unit, false)}</p>
                    <p className="text-xs text-slate-300 mt-1 capitalize">{hour.weather[0].description}</p>
                    <div className="mt-2 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Humidity</span>
                        <span className="font-medium text-white">{hour.main.humidity}%</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

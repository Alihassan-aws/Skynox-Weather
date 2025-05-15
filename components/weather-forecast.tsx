"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ForecastData } from "@/lib/types"
import { getWeatherIcon, formatDate, getWeatherEmoji, formatTemperature } from "@/lib/utils"

interface WeatherForecastProps {
  forecast: ForecastData
  unit: "metric" | "imperial"
}

export function WeatherForecast({ forecast, unit }: WeatherForecastProps) {
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
    .slice(0, 5) // Limit to 5 days

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card className="border-none bg-slate-800/40 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white"
          >
            5-Day Forecast
          </motion.span>
          <motion.span
            className="ml-2 text-sm font-normal text-slate-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {forecast.city.name}, {forecast.city.country}
          </motion.span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-5 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {dailyData.map((day, index) => {
            const date = new Date(day.dt * 1000)
            const weatherIcon = getWeatherIcon(day.weather[0].icon)
            const emoji = getWeatherEmoji(day.weather[0].id)

            return (
              <motion.div
                key={index}
                variants={item}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                className="rounded-xl p-4 text-center bg-slate-700/60 backdrop-blur-sm border border-slate-600/30 transition-all duration-300"
              >
                <p className="font-medium mb-2 text-white">{index === 0 ? "Today" : formatDate(date, "short")}</p>

                <motion.div
                  className="text-4xl my-3 flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.3 + index * 0.1,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  {emoji}
                </motion.div>

                <p className="text-sm capitalize mb-3 text-slate-800 dark:text-slate-200 font-medium">
                  {day.weather[0].description}
                </p>

                <div className="flex justify-between items-center px-2">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {formatTemperature(day.main.temp_min, unit, false)}
                  </span>
                  <div className="h-1.5 flex-1 mx-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-500 dark:from-blue-500 dark:to-violet-600"></div>
                  <span className="text-sm font-bold text-violet-700 dark:text-violet-300">
                    {formatTemperature(day.main.temp_max, unit, false)}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600/30 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-left">
                    <span className="text-slate-600 dark:text-slate-400">Humidity</span>
                    <p className="font-medium text-slate-900 dark:text-white">{day.main.humidity}%</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-600 dark:text-slate-400">Wind</span>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {unit === "metric" ? `${Math.round(day.wind.speed)} m/s` : `${Math.round(day.wind.speed)} mph`}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </Card>
  )
}

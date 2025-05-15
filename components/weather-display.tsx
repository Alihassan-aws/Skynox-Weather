"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { WeatherData } from "@/lib/types"
import { getWeatherIcon, formatDate, getWeatherEmoji, formatTemperature } from "@/lib/utils"
import { Droplets, Wind, Gauge, Eye, Sunrise, Sunset, MapPin } from 'lucide-react'
import { WeatherAnimation } from "@/components/weather-animation"

interface WeatherDisplayProps {
  weather: WeatherData
  timeOfDay: "day" | "night"
  unit: "metric" | "imperial"
}

export function WeatherDisplay({ weather, timeOfDay, unit }: WeatherDisplayProps) {
  const weatherIcon = getWeatherIcon(weather.weather[0].icon)
  const emoji = getWeatherEmoji(weather.weather[0].id)

  // Format sunrise and sunset times in the location's timezone
  const formatTimeInTimezone = (timestamp: number) => {
    const date = new Date((timestamp + weather.timezone) * 1000)
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const sunriseTime = formatTimeInTimezone(weather.sys.sunrise)
  const sunsetTime = formatTimeInTimezone(weather.sys.sunset)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <Card className="overflow-hidden border-none bg-slate-800/40 backdrop-blur-md shadow-xl rounded-2xl">
      <div className="relative h-40 overflow-hidden">
        <WeatherAnimation weatherId={weather.weather[0].id} timeOfDay={timeOfDay} />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="text-7xl"
            whileHover={{
              scale: 1.2,
              rotate: [0, -10, 10, -10, 0],
              transition: { duration: 0.5 },
            }}
          >
            {emoji}
          </motion.div>
        </div>
      </div>

      <CardContent className="p-6">
        <motion.div variants={container} initial="hidden" animate="show">
          <div className="flex justify-between items-start mb-6">
            <motion.div variants={item}>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-white">{weather.name}</h2>
                <span className="ml-1 text-sm font-normal text-slate-300">{weather.sys.country}</span>
                <MapPin className="h-4 w-4 ml-1 text-slate-300" />
              </div>
              <p className="text-sm text-slate-300">
                {formatDate(new Date((Date.now() / 1000 + weather.timezone) * 1000), "full", weather.timezone)}
              </p>
            </motion.div>

            <motion.div variants={item} whileHover={{ scale: 1.05 }} className="text-right">
              <div className="text-5xl font-bold text-white">{formatTemperature(weather.main.temp, unit)}</div>
              <div className="flex items-center justify-end mt-1 text-sm text-slate-300 font-medium">
                <span>Feels like {formatTemperature(weather.main.feels_like, unit)}</span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={item} className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-lg mr-2">{weatherIcon}</span>
              <span className="capitalize font-medium text-white">{weather.weather[0].description}</span>
            </div>
          </motion.div>

          <motion.div variants={container} className="grid grid-cols-2 gap-4">
            {[
              {
                icon: <Droplets className="h-4 w-4 text-blue-400" />,
                label: "Humidity",
                value: `${weather.main.humidity}%`,
              },
              {
                icon: <Wind className="h-4 w-4 text-blue-400" />,
                label: "Wind",
                value:
                  unit === "metric" ? `${Math.round(weather.wind.speed)} m/s` : `${Math.round(weather.wind.speed)} mph`,
              },
              {
                icon: <Gauge className="h-4 w-4 text-blue-400" />,
                label: "Pressure",
                value: `${weather.main.pressure} hPa`,
              },
              {
                icon: <Eye className="h-4 w-4 text-blue-400" />,
                label: "Visibility",
                value:
                  unit === "metric"
                    ? `${(weather.visibility / 1000).toFixed(1)} km`
                    : `${(weather.visibility / 1609).toFixed(1)} mi`,
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                variants={item}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
                className="flex items-center p-3 rounded-xl bg-slate-700/70 backdrop-blur-sm border border-slate-600/20 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="mr-3 p-2 rounded-full bg-blue-900/50">{item.icon}</div>
                <div>
                  <p className="text-xs text-slate-300">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={item} className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-amber-900/40 to-amber-800/30 backdrop-blur-sm border border-amber-700/30 shadow-sm">
              <div className="mr-3 p-2 rounded-full bg-amber-900/50">
                <Sunrise className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-amber-300">Sunrise</p>
                <p className="text-sm font-semibold text-amber-100">{sunriseTime}</p>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-xl bg-gradient-to-r from-indigo-900/40 to-indigo-800/30 backdrop-blur-sm border border-indigo-700/30 shadow-sm">
              <div className="mr-3 p-2 rounded-full bg-indigo-900/50">
                <Sunset className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-indigo-300">Sunset</p>
                <p className="text-sm font-semibold text-indigo-100">{sunsetTime}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface WeatherBackgroundProps {
  weatherId: number
  timeOfDay: "day" | "night"
}

export function WeatherBackground({ weatherId, timeOfDay }: WeatherBackgroundProps) {
  const [bgClass, setBgClass] = useState("")

  useEffect(() => {
    // Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800"
          : "bg-gradient-to-br from-slate-800 via-slate-900 to-black",
      )
    }
    // Drizzle and Rain
    else if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
          : "bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900",
      )
    }
    // Snow
    else if (weatherId >= 600 && weatherId < 700) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-blue-100 via-slate-100 to-white"
          : "bg-gradient-to-br from-slate-700 via-blue-900 to-slate-800",
      )
    }
    // Atmosphere (fog, mist, etc)
    else if (weatherId >= 700 && weatherId < 800) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500"
          : "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
      )
    }
    // Clear
    else if (weatherId === 800) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-sky-300 via-blue-400 to-blue-500"
          : "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900",
      )
    }
    // Clouds
    else if (weatherId > 800) {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-slate-300 via-blue-200 to-slate-200"
          : "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900",
      )
    }
    // Default
    else {
      setBgClass(
        timeOfDay === "day"
          ? "bg-gradient-to-br from-sky-300 via-blue-400 to-blue-500"
          : "bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900",
      )
    }
  }, [weatherId, timeOfDay])

  return (
    <motion.div
      className={`fixed inset-0 ${bgClass} transition-colors duration-1000`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}

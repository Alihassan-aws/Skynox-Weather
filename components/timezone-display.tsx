"use client"

import { useState, useEffect, useRef } from "react"
import { Clock } from 'lucide-react'
import { motion } from "framer-motion"

interface TimezoneDisplayProps {
  timezone: number // Timezone offset in seconds
  cityName: string
  countryCode: string
}

export function TimezoneDisplay({ timezone, cityName, countryCode }: TimezoneDisplayProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Update the time every minute
  useEffect(() => {
    // Calculate the local time in the timezone
    const updateTime = () => {
      setCurrentTime(new Date())
    }

    // Update immediately
    updateTime()

    // Then update every minute
    intervalRef.current = setInterval(updateTime, 60000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, []) // Only run on mount, not when timezone changes

  // Format the time for the given timezone
  const formatTimeForTimezone = () => {
    try {
      // Get current UTC time in milliseconds
      const utcTime = currentTime.getTime()

      // Add the timezone offset (converting from seconds to milliseconds)
      const localTime = new Date(utcTime + timezone * 1000)

      // Format to 12-hour time
      return localTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      console.error("Error formatting time:", error)
      return "Time unavailable"
    }
  }

  // Format timezone offset as GMT+X or GMT-X
  const formatTimezoneOffset = (offsetSeconds: number) => {
    const hours = Math.abs(Math.floor(offsetSeconds / 3600))
    const minutes = Math.abs(Math.floor((offsetSeconds % 3600) / 60))

    const sign = offsetSeconds >= 0 ? "+" : "-"

    if (minutes === 0) {
      return `GMT${sign}${hours}`
    } else {
      return `GMT${sign}${hours}:${minutes.toString().padStart(2, "0")}`
    }
  }

  return (
    <motion.div
      className="flex items-center gap-2 text-white/90 text-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Clock className="h-3.5 w-3.5" />
      <div>
        <span className="font-medium">{formatTimeForTimezone()}</span>
        <span className="mx-1.5 text-white/60">•</span>
        <span className="text-white/80">{formatTimezoneOffset(timezone)}</span>
      </div>
    </motion.div>
  )
}

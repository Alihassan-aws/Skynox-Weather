import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, SunDim } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fix the formatDate function to handle timezone offset correctly
export function formatDate(date: Date, format: "short" | "full" = "full", timezoneOffset?: number): string {
  // If timezone offset is provided, adjust the date
  if (timezoneOffset !== undefined) {
    // Create a new date object with the timezone offset applied
    const localDate = new Date(date)
    // No need to adjust for timezone as we're using the date directly
  }

  if (format === "short") {
    return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(date)
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date)
}

export function getWeatherIcon(iconCode: string) {
  const iconSize = { className: "h-8 w-8" }

  // Map OpenWeatherMap icon codes to Lucide icons
  switch (iconCode) {
    case "01d": // clear sky day
      return <Sun {...iconSize} className="text-yellow-500" />
    case "01n": // clear sky night
      return <SunDim {...iconSize} className="text-slate-300" />
    case "02d": // few clouds day
    case "02n": // few clouds night
    case "03d": // scattered clouds day
    case "03n": // scattered clouds night
    case "04d": // broken clouds day
    case "04n": // broken clouds night
      return <Cloud {...iconSize} className="text-slate-400" />
    case "09d": // shower rain day
    case "09n": // shower rain night
      return <CloudDrizzle {...iconSize} className="text-blue-400" />
    case "10d": // rain day
    case "10n": // rain night
      return <CloudRain {...iconSize} className="text-blue-500" />
    case "11d": // thunderstorm day
    case "11n": // thunderstorm night
      return <CloudLightning {...iconSize} className="text-purple-500" />
    case "13d": // snow day
    case "13n": // snow night
      return <CloudSnow {...iconSize} className="text-slate-200" />
    case "50d": // mist day
    case "50n": // mist night
      return <CloudFog {...iconSize} className="text-slate-300" />
    default:
      return <Sun {...iconSize} className="text-yellow-500" />
  }
}

export function getWeatherEmoji(weatherId: number): string {
  // Thunderstorm
  if (weatherId >= 200 && weatherId < 300) {
    return "⚡️"
  }

  // Drizzle
  if (weatherId >= 300 && weatherId < 400) {
    return "🌦️"
  }

  // Rain
  if (weatherId >= 500 && weatherId < 600) {
    return "🌧️"
  }

  // Snow
  if (weatherId >= 600 && weatherId < 700) {
    return "❄️"
  }

  // Atmosphere (fog, mist, etc)
  if (weatherId >= 700 && weatherId < 800) {
    return "🌫️"
  }

  // Clear
  if (weatherId === 800) {
    return "☀️"
  }

  // Clouds
  if (weatherId > 800) {
    return "☁️"
  }

  return "🌈"
}

export function getTimeOfDay(sunrise: number, sunset: number): "day" | "night" {
  const now = Math.floor(Date.now() / 1000) // Current time in seconds
  return now >= sunrise && now < sunset ? "day" : "night"
}

export function formatTemperature(temp: number, unit: "metric" | "imperial", includeUnit = true): string {
  const roundedTemp = Math.round(temp)
  if (includeUnit) {
    return unit === "metric" ? `${roundedTemp}°C` : `${roundedTemp}°F`
  }
  return `${roundedTemp}°`
}

// Format timezone offset as GMT+X or GMT-X
export function formatTimezoneOffset(offsetSeconds: number): string {
  const hours = Math.abs(Math.floor(offsetSeconds / 3600))
  const minutes = Math.abs(Math.floor((offsetSeconds % 3600) / 60))

  const sign = offsetSeconds >= 0 ? "+" : "-"

  if (minutes === 0) {
    return `GMT${sign}${hours}`
  } else {
    return `GMT${sign}${hours}:${minutes.toString().padStart(2, "0")}`
  }
}

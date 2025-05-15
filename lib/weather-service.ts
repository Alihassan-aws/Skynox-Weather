import type { WeatherData, ForecastData } from "./types"

const API_KEY = "a6a1943984018541e572e628c5e1feaf"
const BASE_URL = "https://api.openweathermap.org/data/2.5"

export async function getCurrentWeather(city: string, unit: "metric" | "imperial" = "metric"): Promise<WeatherData> {
  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`
    console.log("Fetching weather from:", url)

    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error:", errorData)
      throw new Error(`Weather API error (${response.status}): ${errorData.message || "Unknown error"}`)
    }

    return response.json()
  } catch (error) {
    console.error("Weather fetch error:", error)
    throw new Error(`Failed to get weather for ${city}: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getCurrentWeatherByCoords(
  lat: number,
  lon: number,
  unit: "metric" | "imperial" = "metric",
): Promise<WeatherData> {
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
    console.log("Fetching weather from coords:", url)

    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error:", errorData)
      throw new Error(`Weather API error (${response.status}): ${errorData.message || "Unknown error"}`)
    }

    return response.json()
  } catch (error) {
    console.error("Weather fetch error:", error)
    throw new Error(
      `Failed to get weather for coordinates: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

export async function getForecast(city: string, unit: "metric" | "imperial" = "metric"): Promise<ForecastData> {
  try {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`
    console.log("Fetching forecast from:", url)

    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error:", errorData)
      throw new Error(`Forecast API error (${response.status}): ${errorData.message || "Unknown error"}`)
    }

    return response.json()
  } catch (error) {
    console.error("Forecast fetch error:", error)
    throw new Error(`Failed to get forecast for ${city}: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getForecastByCoords(
  lat: number,
  lon: number,
  unit: "metric" | "imperial" = "metric",
): Promise<ForecastData> {
  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
    console.log("Fetching forecast from coords:", url)

    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API Error:", errorData)
      throw new Error(`Forecast API error (${response.status}): ${errorData.message || "Unknown error"}`)
    }

    return response.json()
  } catch (error) {
    console.error("Forecast fetch error:", error)
    throw new Error(
      `Failed to get forecast for coordinates: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

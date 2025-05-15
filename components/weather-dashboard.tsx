"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MapPin, Loader2, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WeatherDisplay } from "@/components/weather-display"
import { WeatherForecast } from "@/components/weather-forecast"
import { getCurrentWeather, getForecast, getCurrentWeatherByCoords, getForecastByCoords } from "@/lib/weather-service"
import type { WeatherData, ForecastData } from "@/lib/types"
import { EnhancedWeatherAnimation } from "@/components/enhanced-weather-animation"
import { getTimeOfDay } from "@/lib/utils"
import { UnitToggle } from "@/components/unit-toggle"
import { useGeolocation } from "@/hooks/use-geolocation"
import { LocationButton } from "@/components/location-button"
import { TimezoneDisplay } from "@/components/timezone-display"
import { HourlyForecast } from "@/components/hourly-forecast"
// Import chart registry to ensure Chart.js is properly registered
import "@/lib/chart-registry"

export function WeatherDashboard() {
  // Change default city to Faisalabad
  const [city, setCity] = useState("Faisalabad")
  const [searchInput, setSearchInput] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day")
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [usingLocation, setUsingLocation] = useState(false)

  const {
    loading: locationLoading,
    error: locationError,
    data: locationData,
    getLocation,
    retryLocation,
    locationPermissionStatus,
  } = useGeolocation()

  // Initial load - load default city if not using location
  useEffect(() => {
    if (locationPermissionStatus === "granted") {
      handleLocationRequest()
    } else {
      // Otherwise load default city (Faisalabad)
      fetchWeatherData(city)
    }
  }, []) // Empty dependency array to run only once on mount

  // When location data changes, update weather
  useEffect(() => {
    if (locationData && !loading) {
      fetchWeatherByCoords(locationData.latitude, locationData.longitude)
    }
  }, [locationData, unit])

  // When city changes (via search), update weather
  useEffect(() => {
    if (!usingLocation && city) {
      fetchWeatherData(city)
    }
  }, [city, unit, usingLocation])

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true)
    setError("")
    setUsingLocation(false)

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(cityName, unit),
        getForecast(cityName, unit),
      ])

      setWeather(weatherData)
      setForecast(forecastData)

      // Determine if it's day or night based on sunrise/sunset
      setTimeOfDay(getTimeOfDay(weatherData.sys.sunrise, weatherData.sys.sunset))
    } catch (err) {
      console.error("Error fetching weather data:", err)

      if (cityName !== "Faisalabad") {
        setError(`Could not find "${cityName}". Showing Faisalabad instead.`)
        try {
          const [fallbackWeather, fallbackForecast] = await Promise.all([
            getCurrentWeather("Faisalabad", unit),
            getForecast("Faisalabad", unit),
          ])

          setWeather(fallbackWeather)
          setForecast(fallbackForecast)
          setCity("Faisalabad")
          setTimeOfDay(getTimeOfDay(fallbackWeather.sys.sunrise, fallbackWeather.sys.sunset))
        } catch (fallbackErr) {
          setError("Failed to fetch weather data. Please try again.")
        }
      } else {
        setError("Failed to fetch weather data. Please try again.")
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true)
    setError("")
    setUsingLocation(true)

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeatherByCoords(lat, lon, unit),
        getForecastByCoords(lat, lon, unit),
      ])

      setWeather(weatherData)
      setForecast(forecastData)
      setCity(weatherData.name) // Update city name from API response

      // Determine if it's day or night based on sunrise/sunset
      setTimeOfDay(getTimeOfDay(weatherData.sys.sunrise, weatherData.sys.sunset))
    } catch (err) {
      console.error("Error fetching weather data by coordinates:", err)
      setError("Failed to get weather for your location. Showing default city.")

      try {
        const [fallbackWeather, fallbackForecast] = await Promise.all([
          getCurrentWeather("Faisalabad", unit),
          getForecast("Faisalabad", unit),
        ])

        setWeather(fallbackWeather)
        setForecast(fallbackForecast)
        setCity("Faisalabad")
        setUsingLocation(false)
        setTimeOfDay(getTimeOfDay(fallbackWeather.sys.sunrise, fallbackWeather.sys.sunset))
      } catch (fallbackErr) {
        setError("Failed to fetch weather data. Please try again.")
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setCity(searchInput)
      setSearchInput("")
      setUsingLocation(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchInput.trim()) {
      setCity(searchInput)
      setSearchInput("")
      setUsingLocation(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    if (usingLocation && locationData) {
      fetchWeatherByCoords(locationData.latitude, locationData.longitude)
    } else {
      fetchWeatherData(city)
    }
  }

  const handleLocationRequest = async () => {
    try {
      if (locationPermissionStatus === "denied") {
        setError("Location permission denied. Please enable location access in your browser settings.")
        return
      }

      await getLocation()

      if (locationError) {
        setError(locationError)
      }
    } catch (err) {
      setError("Failed to get your location. Please try again or search for a city.")
    }
  }

  const handleUnitChange = (newUnit: "metric" | "imperial") => {
    setUnit(newUnit)
  }

  return (
    <>
      {weather && <EnhancedWeatherAnimation weatherId={weather.weather[0].id} timeOfDay={timeOfDay} />}

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <UnitToggle currentUnit={unit} onUnitChange={handleUnitChange} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-8"
        >
          <motion.h1
            className="text-5xl font-bold text-white mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.1,
            }}
          >
            
          </motion.h1>

          <motion.form
            onSubmit={handleSearch}
            className="flex w-full max-w-md gap-2 mb-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <Input
                type="text"
                placeholder="Search for a city"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-10 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-slate-300 rounded-full shadow-sm"
              />
            </div>
            <LocationButton
              onClick={handleLocationRequest}
              loading={locationLoading}
              permissionStatus={locationPermissionStatus}
              locationActive={usingLocation}
              locationError={locationError}
            />
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-4 flex flex-col sm:flex-row items-center gap-3 justify-center"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="text-white hover:text-white/80 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            {usingLocation && (
              <span className="text-xs text-white/80 flex items-center">
                <MapPin className="h-3 w-3 mr-1 text-green-400" />
                Using your location
              </span>
            )}

            {weather && weather.timezone !== undefined && (
              <TimezoneDisplay timezone={weather.timezone} cityName={weather.name} countryCode={weather.sys.country} />
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 mb-6 bg-red-900/30 backdrop-blur-md border-red-800/50 shadow-sm">
                <p className="text-red-300 text-center font-medium">{error}</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center h-[400px] rounded-2xl bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-xl"
                >
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
                    <p className="text-white animate-pulse font-medium">Loading weather data...</p>
                  </div>
                </motion.div>
              ) : (
                weather && (
                  <motion.div
                    key="weather"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <WeatherDisplay weather={weather} timeOfDay={timeOfDay} unit={unit} />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-forecast"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center h-[400px] rounded-2xl bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-xl"
                >
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
                    <p className="text-white animate-pulse">Loading forecast data...</p>
                  </div>
                </motion.div>
              ) : (
                forecast && (
                  <motion.div
                    key="forecast"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <WeatherForecast forecast={forecast} unit={unit} />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Hourly Forecast Section */}
        {forecast && !loading && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <HourlyForecast forecast={forecast} unit={unit} />
          </motion.div>
        )}
      </div>
    </>
  )
}

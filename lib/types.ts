export interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
    deg: number
  }
  visibility: number
  sys: {
    country: string
    sunrise: number
    sunset: number
  }
  dt: number
  timezone: number // Timezone offset in seconds from UTC
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
    deg: number
  }
  visibility: number
  pop: number // Probability of precipitation
  dt_txt: string
}

export interface ForecastData {
  list: ForecastItem[]
  city: {
    name: string
    country: string
    timezone: number // Timezone offset in seconds from UTC
  }
}

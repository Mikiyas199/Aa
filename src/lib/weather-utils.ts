import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, SunDim } from "lucide-react"
import { ComponentType } from "react"
import { WeatherData } from "@/store/weather-store"

// API key for OpenWeather API
export const WEATHER_API_KEY = "f696a40b14ebdc238f8ab00cad2cdebc"

// API endpoints
export const CURRENT_WEATHER_API = "https://api.openweathermap.org/data/2.5/weather"
export const FORECAST_API = "https://api.openweathermap.org/data/2.5/forecast"

export function getWeatherIcon(condition: string): ComponentType<any> {
  const conditionLower = condition.toLowerCase()
  
  if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) {
    return CloudLightning
  }
  
  if (conditionLower.includes('rain') || conditionLower.includes('shower')) {
    return CloudRain
  }
  
  if (conditionLower.includes('drizzle')) {
    return CloudDrizzle
  }
  
  if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
    return CloudSnow
  }
  
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return CloudFog
  }
  
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return Sun
  }
  
  if (conditionLower.includes('partly')) {
    return SunDim
  }
  
  // Default or cloudy
  return Cloud
}

export function getBackgroundGradient(condition: string, isDay: boolean = true): string {
  const conditionLower = condition.toLowerCase()
  
  if (!isDay) {
    return 'from-gray-900 to-blue-900'
  }
  
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return 'from-blue-400 to-sky-300'
  }
  
  if (conditionLower.includes('partly')) {
    return 'from-blue-500 to-sky-400'
  }
  
  if (conditionLower.includes('cloudy')) {
    return 'from-blue-500 to-gray-400'
  }
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
    return 'from-gray-600 to-blue-600'
  }
  
  if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) {
    return 'from-gray-800 to-blue-900'
  }
  
  if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
    return 'from-blue-100 to-gray-200'
  }
  
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return 'from-gray-300 to-gray-400'
  }
  
  // Default
  return 'from-blue-500 to-sky-400'
}

// Convert Kelvin to Celsius
export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15)
}

// Convert Celsius to Fahrenheit
export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9/5) + 32)
}

// Format timestamp to time string (e.g., "14:00")
export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Format timestamp to day string (e.g., "Mon")
export function formatDay(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'short' })
}

// Format timestamp to date string (e.g., "Jul 19")
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' })
}

// Process OpenWeather API data into our app's format
export function processWeatherData(currentData: any, forecastData: any): WeatherData {
  const hourlyForecast = forecastData.list.slice(0, 12).map((item: any) => ({
    time: formatTime(item.dt),
    temperature: kelvinToCelsius(item.main.temp),
    condition: item.weather[0].main,
    precipitationChance: Math.round(item.pop * 100)
  }))

  // Group forecast by day and extract daily data
  const dailyMap = new Map()
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString()
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        temps: [item.main.temp],
        conditions: [item.weather[0].main],
        precipChances: [item.pop * 100],
        timestamp: item.dt
      })
    } else {
      const day = dailyMap.get(date)
      day.temps.push(item.main.temp)
      day.conditions.push(item.weather[0].main)
      day.precipChances.push(item.pop * 100)
    }
  })

  const dailyForecast = Array.from(dailyMap.values()).slice(0, 7).map((day: any) => {
    // Find most common condition
    const conditionCounts: Record<string, number> = {}
    day.conditions.forEach((c: string) => {
      conditionCounts[c] = (conditionCounts[c] || 0) + 1
    })
    const condition = Object.entries(conditionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])[0]

    return {
      date: formatDate(day.timestamp),
      day: formatDay(day.timestamp),
      highTemp: kelvinToCelsius(Math.max(...day.temps)),
      lowTemp: kelvinToCelsius(Math.min(...day.temps)),
      condition: condition,
      precipitationChance: Math.round(Math.max(...day.precipChances))
    }
  })

  // Ensure we have a "Today" label for current day
  if (dailyForecast.length > 0) {
    dailyForecast[0].date = "Today"
  }

  return {
    location: `${currentData.name}, ${currentData.sys.country}`,
    temperature: kelvinToCelsius(currentData.main.temp),
    condition: currentData.weather[0].main,
    highTemp: kelvinToCelsius(currentData.main.temp_max),
    lowTemp: kelvinToCelsius(currentData.main.temp_min),
    feelsLike: kelvinToCelsius(currentData.main.feels_like),
    humidity: currentData.main.humidity,
    windSpeed: Math.round(currentData.wind.speed),
    windDirection: getWindDirection(currentData.wind.deg),
    precipitation: forecastData.list[0].pop * 100, // Probability of precipitation from first forecast
    pressure: currentData.main.pressure,
    visibility: currentData.visibility / 1000, // Convert to km
    uvIndex: 0, // Not provided by basic OpenWeather API
    sunrise: formatTime(currentData.sys.sunrise),
    sunset: formatTime(currentData.sys.sunset),
    hourlyForecast,
    dailyForecast
  }
}

// Convert wind degrees to direction
function getWindDirection(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}
import { create } from 'zustand'
import { WEATHER_API_KEY, CURRENT_WEATHER_API, FORECAST_API, processWeatherData } from '@/lib/weather-utils'

export interface WeatherData {
  location: string
  temperature: number
  condition: string
  highTemp: number
  lowTemp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: string
  precipitation: number
  pressure: number
  visibility: number
  uvIndex: number
  sunrise: string
  sunset: string
  hourlyForecast: Array<{
    time: string
    temperature: number
    condition: string
    precipitationChance: number
  }>
  dailyForecast: Array<{
    date: string
    day: string
    highTemp: number
    lowTemp: number
    condition: string
    precipitationChance: number
  }>
}

export interface LocationInfo {
  id: string
  name: string
  country: string
  isDefault?: boolean
  isCurrent?: boolean
}

interface WeatherStore {
  isLoading: boolean
  selectedLocation: LocationInfo | null
  savedLocations: LocationInfo[]
  currentWeather: WeatherData | null
  searchTerm: string
  error: string | null
  unit: 'celsius' | 'fahrenheit'
  
  // Actions
  setSelectedLocation: (location: LocationInfo) => void
  addSavedLocation: (location: LocationInfo) => void
  removeSavedLocation: (locationId: string) => void
  fetchWeatherData: (locationName: string) => Promise<void>
  setSearchTerm: (term: string) => void
  toggleUnit: () => void
}

// Default locations
const defaultLocations: LocationInfo[] = [
  { id: "1", name: "New York", country: "US", isDefault: true },
  { id: "2", name: "London", country: "UK" },
  { id: "3", name: "Tokyo", country: "JP" },
  { id: "4", name: "Sydney", country: "AU" }
]

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  isLoading: false,
  selectedLocation: defaultLocations[0],
  savedLocations: defaultLocations,
  currentWeather: null,
  searchTerm: "",
  error: null,
  unit: 'celsius',
  
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  
  addSavedLocation: (location) => {
    set((state) => ({
      savedLocations: [...state.savedLocations, location]
    }))
  },
  
  removeSavedLocation: (locationId) => {
    set((state) => ({
      savedLocations: state.savedLocations.filter(loc => loc.id !== locationId)
    }))
  },
  
  fetchWeatherData: async (locationName) => {
    set({ isLoading: true, error: null })
    
    try {
      // Parse location query - expects "City, Country"
      const [city] = locationName.split(',').map(part => part.trim())
      
      // Fetch current weather data
      const currentResponse = await fetch(
        `${CURRENT_WEATHER_API}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}`
      )
      
      if (!currentResponse.ok) {
        throw new Error(`Weather API error: ${currentResponse.statusText}`)
      }
      
      const currentData = await currentResponse.json()
      
      // Fetch forecast data for hourly and daily forecasts
      const forecastResponse = await fetch(
        `${FORECAST_API}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}`
      )
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.statusText}`)
      }
      
      const forecastData = await forecastResponse.json()
      
      // Process API data into our application format
      const weatherData = processWeatherData(currentData, forecastData)
      
      set({ currentWeather: weatherData, isLoading: false })
    } catch (error) {
      console.error("Weather fetch error:", error)
      set({ 
        error: "Failed to fetch weather data. Please check the location name and try again.", 
        isLoading: false 
      })
    }
  },
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  toggleUnit: () => {
    set((state) => ({
      unit: state.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    }))
  }
}))
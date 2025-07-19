import { Cloud, CloudRain, Sun, Thermometer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useWeatherStore } from '@/store/weather-store'
import { getWeatherIcon } from '@/lib/weather-utils'

export function CurrentWeather() {
  const { currentWeather, unit } = useWeatherStore()
  
  if (!currentWeather) return null
  
  // Convert temperature based on selected unit
  const formatTemp = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round(temp * 9/5 + 32)
    }
    return Math.round(temp)
  }
  
  const mainTemp = formatTemp(currentWeather.temperature)
  const highTemp = formatTemp(currentWeather.highTemp)
  const lowTemp = formatTemp(currentWeather.lowTemp)
  const feelsLike = formatTemp(currentWeather.feelsLike)
  
  const WeatherIcon = getWeatherIcon(currentWeather.condition)

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-200">{currentWeather.location}</h2>
            <p className="text-gray-500 dark:text-gray-400">Today • {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <WeatherIcon className="h-16 w-16 text-blue-500" />
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800 dark:text-white">{mainTemp}°</div>
              <p className="text-gray-500 dark:text-gray-400">{currentWeather.condition}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <Thermometer className="h-5 w-5 text-amber-500 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Feels Like</span>
            <span className="font-medium">{feelsLike}°</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <Sun className="h-5 w-5 text-amber-500 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">High / Low</span>
            <span className="font-medium">{highTemp}° / {lowTemp}°</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <CloudRain className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Precipitation</span>
            <span className="font-medium">{currentWeather.precipitation}%</span>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
            <Cloud className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Humidity</span>
            <span className="font-medium">{currentWeather.humidity}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
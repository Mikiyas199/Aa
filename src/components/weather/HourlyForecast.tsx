import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeatherStore } from "@/store/weather-store"
import { getWeatherIcon } from "@/lib/weather-utils"

export function HourlyForecast() {
  const { currentWeather, unit } = useWeatherStore()
  
  if (!currentWeather || !currentWeather.hourlyForecast) return null
  
  // Convert temperature based on selected unit
  const formatTemp = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round(temp * 9/5 + 32)
    }
    return Math.round(temp)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex gap-4">
            {currentWeather.hourlyForecast.map((hour, index) => {
              const WeatherIcon = getWeatherIcon(hour.condition)
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center justify-between min-w-[70px] p-2 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{hour.time}</span>
                  <WeatherIcon className="my-2 h-6 w-6 text-blue-500" />
                  <span className="text-lg font-bold">{formatTemp(hour.temperature)}°</span>
                  <span className="text-xs text-blue-500 mt-1">{hour.precipitationChance}%</span>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
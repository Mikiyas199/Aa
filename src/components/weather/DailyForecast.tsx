import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useWeatherStore } from "@/store/weather-store"
import { getWeatherIcon } from "@/lib/weather-utils"

export function DailyForecast() {
  const { currentWeather, unit } = useWeatherStore()
  
  if (!currentWeather || !currentWeather.dailyForecast) return null
  
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
        <CardTitle className="text-lg">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div>
          {currentWeather.dailyForecast.map((day, index) => {
            const WeatherIcon = getWeatherIcon(day.condition)
            const isFirst = index === 0
            
            return (
              <div key={index}>
                {!isFirst && <Separator />}
                <div className="grid grid-cols-4 items-center py-3 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{day.date}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{day.day}</span>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <WeatherIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  
                  <div className="flex justify-center">
                    <span className="text-xs text-blue-500">{day.precipitationChance}%</span>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-medium">{formatTemp(day.highTemp)}°</span>
                    <span className="text-gray-400 dark:text-gray-500">{formatTemp(day.lowTemp)}°</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
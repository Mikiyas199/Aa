import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CloudRain, Compass, Gauge, Sun, Sunrise, Sunset, ThermometerSun, Wind } from "lucide-react"
import { useWeatherStore } from "@/store/weather-store"

export function WeatherDetails() {
  const { currentWeather } = useWeatherStore()
  
  if (!currentWeather) return null
  
  const detailItems = [
    {
      label: "Feels Like",
      value: `${currentWeather.feelsLike}°`,
      icon: <ThermometerSun className="w-4 h-4 text-orange-500" />
    },
    {
      label: "Humidity",
      value: `${currentWeather.humidity}%`,
      icon: <CloudRain className="w-4 h-4 text-blue-500" />
    },
    {
      label: "Wind",
      value: `${currentWeather.windSpeed} km/h`,
      icon: <Wind className="w-4 h-4 text-blue-400" />
    },
    {
      label: "Direction",
      value: currentWeather.windDirection,
      icon: <Compass className="w-4 h-4 text-gray-500" />
    },
    {
      label: "Pressure",
      value: `${currentWeather.pressure} hPa`,
      icon: <Gauge className="w-4 h-4 text-gray-500" />
    },
    {
      label: "UV Index",
      value: currentWeather.uvIndex.toString(),
      icon: <Sun className="w-4 h-4 text-amber-500" />
    },
    {
      label: "Sunrise",
      value: currentWeather.sunrise,
      icon: <Sunrise className="w-4 h-4 text-amber-400" />
    },
    {
      label: "Sunset",
      value: currentWeather.sunset,
      icon: <Sunset className="w-4 h-4 text-orange-500" />
    }
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {detailItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-3 bg-blue-50/60 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                {item.icon}
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { WeatherHeader } from '@/components/weather/WeatherHeader'
import { CurrentWeather } from '@/components/weather/CurrentWeather'
import { HourlyForecast } from '@/components/weather/HourlyForecast'
import { DailyForecast } from '@/components/weather/DailyForecast'
import { WeatherDetails } from '@/components/weather/WeatherDetails'
import { WelcomeNotification } from '@/components/weather/WelcomeNotification'
import { Button } from '@/components/ui/button'
import { useWeatherStore } from '@/store/weather-store'
import { ChevronRight, BarChart2 } from 'lucide-react'

function HomePage() {
  const { fetchWeatherData, selectedLocation, isLoading } = useWeatherStore()

  useEffect(() => {
    if (selectedLocation) {
      fetchWeatherData(`${selectedLocation.name}, ${selectedLocation.country}`)
    }
  }, [fetchWeatherData, selectedLocation])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-950 dark:to-blue-950">
      <WeatherHeader />
      <WelcomeNotification />
      
      <main className="container mx-auto p-4 pb-16">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <CurrentWeather />
            
            <div className="flex justify-end">
              <Link to="/forecast">
                <Button variant="outline" className="flex items-center gap-1">
                  <BarChart2 className="h-4 w-4" />
                  <span>View Detailed Forecast</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <HourlyForecast />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DailyForecast />
              <WeatherDetails />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default HomePage
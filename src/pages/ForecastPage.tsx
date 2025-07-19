import { WeatherHeader } from '@/components/weather/WeatherHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWeatherStore } from '@/store/weather-store'
import { getWeatherIcon } from '@/lib/weather-utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ForecastPage() {
  const { currentWeather, unit } = useWeatherStore()

  if (!currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-950 dark:to-blue-950">
        <WeatherHeader />
        <div className="container mx-auto p-4 flex justify-center items-center h-64">
          <p>Loading forecast data...</p>
        </div>
      </div>
    )
  }

  // Convert temperature based on selected unit
  const formatTemp = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round(temp * 9/5 + 32)
    }
    return Math.round(temp)
  }

  // Format data for temperature chart
  const tempChartData = currentWeather.dailyForecast.map(day => ({
    name: day.day,
    high: formatTemp(day.highTemp),
    low: formatTemp(day.lowTemp)
  }))

  // Format data for precipitation chart
  const precipChartData = currentWeather.dailyForecast.map(day => ({
    name: day.day,
    precipitation: day.precipitationChance
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-950 dark:to-blue-950">
      <WeatherHeader />
      
      <main className="container mx-auto p-4 pb-16">
        <h1 className="text-2xl font-bold mb-6">Detailed Forecast for {currentWeather.location}</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Temperature Forecast (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={tempChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: `Temperature (°${unit === 'celsius' ? 'C' : 'F'})`, angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="high" name={`High (°${unit === 'celsius' ? 'C' : 'F'})`} fill="#ff7e67" />
                    <Bar dataKey="low" name={`Low (°${unit === 'celsius' ? 'C' : 'F'})`} fill="#7db9e8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Precipitation Forecast (7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={precipChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Precipitation (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="precipitation" name="Precipitation (%)" fill="#4299e1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Weather Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentWeather.dailyForecast.map((day, index) => {
                  const WeatherIcon = getWeatherIcon(day.condition)
                  return (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{day.date}</h3>
                            <p className="text-sm text-muted-foreground">{day.day}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <WeatherIcon className="h-6 w-6 text-blue-500" />
                            <span>{day.condition}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">High</p>
                            <p className="font-medium">{formatTemp(day.highTemp)}°</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Low</p>
                            <p className="font-medium">{formatTemp(day.lowTemp)}°</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Precipitation</p>
                            <p className="font-medium">{day.precipitationChance}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ForecastPage
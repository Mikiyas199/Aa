import { useState } from 'react'
import { Search, MapPin, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useWeatherStore, LocationInfo } from '@/store/weather-store'

export function WeatherHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { 
    selectedLocation,
    savedLocations,
    setSelectedLocation,
    fetchWeatherData,
    unit,
    toggleUnit
  } = useWeatherStore()

  const handleLocationSelect = (location: LocationInfo) => {
    setSelectedLocation(location)
    fetchWeatherData(`${location.name}, ${location.country}`)
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="flex items-center gap-2 animate-in fade-in">
              <Input
                placeholder="Search for a city..."
                className="bg-white/20 border-none text-white placeholder:text-white/70 focus-visible:ring-white/30"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold">Weather App</h1>
              <div className="hidden md:flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{selectedLocation?.name}, {selectedLocation?.country}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isSearchOpen && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20" 
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={toggleUnit}
          >
            °{unit === 'celsius' ? 'C' : 'F'}
          </Button>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="py-6">
                <h3 className="text-lg font-medium mb-4">Saved Locations</h3>
                <div className="space-y-2">
                  {savedLocations.map((location) => (
                    <Button
                      key={location.id}
                      variant={selectedLocation?.id === location.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {location.name}, {location.country}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
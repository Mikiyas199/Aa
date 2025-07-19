import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export function WelcomeNotification() {
  const { toast } = useToast()

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('skyview_welcome_seen')
    
    if (!hasSeenWelcome) {
      // Show welcome toast after a short delay
      const timer = setTimeout(() => {
        toast({
          title: "Welcome to SkyView",
          description: "Your advanced weather forecasting solution. Explore the dashboard for real-time weather updates.",
          duration: 5000,
        })
        
        // Set flag in localStorage so toast doesn't show again
        localStorage.setItem('skyview_welcome_seen', 'true')
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [toast])

  return null
}
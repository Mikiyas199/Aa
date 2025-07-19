import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CloudOff } from 'lucide-react'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-950 dark:to-blue-950 flex items-center justify-center">
      <div className="text-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm p-10 rounded-xl shadow-lg">
        <div className="flex justify-center mb-4">
          <CloudOff className="w-16 h-16 text-blue-500" />
        </div>
        <h1 className="text-6xl font-bold mb-4 text-blue-600 dark:text-blue-400">404</h1>
        <p className="text-xl mb-6 text-gray-600 dark:text-gray-300">Weather forecast not found</p>
        <Button onClick={() => navigate('/')} size="lg" className="bg-blue-500 hover:bg-blue-600">
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
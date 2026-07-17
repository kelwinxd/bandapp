import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { AppLayout } from './AppLayout'

export function ProtectedRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout />
}

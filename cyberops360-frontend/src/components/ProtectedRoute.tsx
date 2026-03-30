import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../types/cfms'

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
  const { isAuthenticated, isTwoFactorVerified, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isTwoFactorVerified) {
    return <Navigate to="/2fa" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

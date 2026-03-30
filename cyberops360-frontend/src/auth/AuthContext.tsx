import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Role } from '../types/cfms'

interface AuthState {
  isAuthenticated: boolean
  isTwoFactorVerified: boolean
  role: Role
}

interface AuthContextType extends AuthState {
  login: (role: Role) => void
  verifyTwoFactor: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isTwoFactorVerified: false,
    role: 'analyst_l1',
  })

  const value = useMemo(
    () => ({
      ...state,
      login: (role: Role) => {
        setState({ isAuthenticated: true, isTwoFactorVerified: false, role })
      },
      verifyTwoFactor: () => {
        setState((prev) => ({ ...prev, isTwoFactorVerified: true }))
      },
      logout: () => {
        setState({ isAuthenticated: false, isTwoFactorVerified: false, role: 'analyst_l1' })
      },
    }),
    [state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

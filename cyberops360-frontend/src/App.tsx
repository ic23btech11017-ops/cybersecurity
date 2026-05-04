import { lazy, Suspense, useMemo, useState } from 'react'
import { Box, CircularProgress, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { getCfmsTheme } from './theme/cfmsTheme'

const LoginPage = lazy(() => import('./pages/LoginPage').then((mod) => ({ default: mod.LoginPage })))
const TwoFactorPage = lazy(() => import('./pages/TwoFactorPage').then((mod) => ({ default: mod.TwoFactorPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((mod) => ({ default: mod.DashboardPage })))
const ClientsPage = lazy(() => import('./pages/ClientsPage').then((mod) => ({ default: mod.ClientsPage })))
const AssetsPage = lazy(() => import('./pages/AssetsPage').then((mod) => ({ default: mod.AssetsPage })))
const RisksPage = lazy(() => import('./pages/RisksPage').then((mod) => ({ default: mod.RisksPage })))
const IncidentsPage = lazy(() => import('./pages/IncidentsPage').then((mod) => ({ default: mod.IncidentsPage })))
const CompliancePage = lazy(() => import('./pages/CompliancePage').then((mod) => ({ default: mod.CompliancePage })))
const BillingPage = lazy(() => import('./pages/BillingPage').then((mod) => ({ default: mod.BillingPage })))
const SocQueuePage = lazy(() => import('./pages/SupportPages').then((mod) => ({ default: mod.SocQueuePage })))
const EvidencePage = lazy(() => import('./pages/SupportPages').then((mod) => ({ default: mod.EvidencePage })))
const ReportsPage = lazy(() => import('./pages/SupportPages').then((mod) => ({ default: mod.ReportsPage })))
const SlaPage = lazy(() => import('./pages/SupportPages').then((mod) => ({ default: mod.SlaPage })))
const SettingsPage = lazy(() => import('./pages/SupportPages').then((mod) => ({ default: mod.SettingsPage })))

const RouteFallback = () => (
  <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
    <CircularProgress />
  </Box>
)

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const theme = useMemo(() => getCfmsTheme(mode), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/2fa" element={<TwoFactorPage />} />

              <Route element={<ProtectedRoute />}>
                <Route
                  element={<AppShell mode={mode} onToggleMode={() => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))} />}
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/assets" element={<AssetsPage />} />
                  <Route path="/risks" element={<RisksPage />} />
                  <Route path="/incidents" element={<IncidentsPage />} />
                  <Route path="/soc-queue" element={<SocQueuePage />} />
                  <Route path="/compliance" element={<CompliancePage />} />
                  <Route path="/evidence" element={<EvidencePage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/sla" element={<SlaPage />} />

                  <Route element={<ProtectedRoute allowedRoles={['super_admin', 'finance_admin']} />}>
                    <Route path="/billing" element={<BillingPage />} />
                  </Route>

                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

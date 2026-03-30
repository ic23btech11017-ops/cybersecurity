import { useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SnackbarProvider } from './components/SnackbarProvider'
import { getCfmsTheme } from './theme/cfmsTheme'

import { LoginPage } from './pages/LoginPage'
import { TwoFactorPage } from './pages/TwoFactorPage'
import { DashboardPage } from './pages/DashboardPage'
import { ClientsPage } from './pages/ClientsPage'
import { AssetsPage } from './pages/AssetsPage'
import { RisksPage } from './pages/RisksPage'
import { IncidentsPage } from './pages/IncidentsPage'
import { CompliancePage } from './pages/CompliancePage'
import { BillingPage } from './pages/BillingPage'
import { SocQueuePage, EvidencePage, ReportsPage, SlaPage, SettingsPage } from './pages/SupportPages'
import { ProfilePage } from './pages/ProfilePage'
import { ClientDetailsPage } from './pages/ClientDetailsPage'
import { IncidentDetailsPage } from './pages/IncidentDetailsPage'

const App = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const theme = useMemo(() => getCfmsTheme(mode), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/2fa" element={<TwoFactorPage />} />

              <Route element={<ProtectedRoute />}>
                <Route
                  element={<AppShell mode={mode} onToggleMode={() => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))} />}
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/clients/:id" element={<ClientDetailsPage />} />
                  <Route path="/assets" element={<AssetsPage />} />
                  <Route path="/risks" element={<RisksPage />} />
                  <Route path="/incidents" element={<IncidentsPage />} />
                  <Route path="/incidents/:id" element={<IncidentDetailsPage />} />
                  <Route path="/soc-queue" element={<SocQueuePage />} />
                  <Route path="/compliance" element={<CompliancePage />} />
                  <Route path="/evidence" element={<EvidencePage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/sla" element={<SlaPage />} />

                  <Route element={<ProtectedRoute allowedRoles={['super_admin', 'finance_admin']} />}>
                    <Route path="/billing" element={<BillingPage />} />
                  </Route>

                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App

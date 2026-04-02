import { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
  GppGood as ComplianceIcon,
  Analytics as AnalyticsIcon,
  Speed as SlaIcon,
  CheckCircleOutline as CheckIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../types/cfms'

/* ──────────────────── Demo account presets ──────────── */
interface DemoAccount {
  label: string
  email: string
  password: string
  role: Role
  color: string
}

const demoAccounts: DemoAccount[] = [
  { label: 'Super Admin', email: 'admin@cyberops360.com', password: 'admin@2026', role: 'super_admin', color: '#ef4444' },
  { label: 'Analyst L1', email: 'analyst@cyberops360.com', password: 'analyst@2026', role: 'analyst_l1', color: '#29b6f6' },
  { label: 'Compliance', email: 'compliance@cyberops360.com', password: 'compliance@2026', role: 'compliance_manager', color: '#14b8a6' },
  { label: 'Finance', email: 'finance@cyberops360.com', password: 'finance@2026', role: 'finance_admin', color: '#f59e0b' },
]

/* ──────────────────── Feature items ─────────────────── */
const features = [
  { icon: <SecurityIcon />, label: 'Incident Management', desc: 'Track, triage, and resolve threats in real-time' },
  { icon: <ComplianceIcon />, label: 'Compliance Automation', desc: 'ISO 27001, SOC 2, and custom frameworks' },
  { icon: <AnalyticsIcon />, label: 'Risk Analytics', desc: 'Likelihood-impact scoring with heatmaps' },
  { icon: <SlaIcon />, label: 'SLA Tracking', desc: 'Response and resolution SLA monitoring' },
]

/* ──────────────────── System stats ──────────────────── */
const stats = [
  { value: '99.97%', label: 'Uptime' },
  { value: '12', label: 'Modules' },
  { value: '24×7', label: 'SOC' },
  { value: '45K+', label: 'Alerts' },
]

/* ══════════════════════════════════════════════════════ */
/*                   LOGIN PAGE COMPONENT                */
/* ══════════════════════════════════════════════════════ */
export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  if (isAuthenticated) {
    return <Navigate to="/2fa" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Match demo accounts
    const match = demoAccounts.find((a) => a.email === email && a.password === password)
    if (match) {
      login(match.role)
      navigate('/2fa')
    } else {
      // Default: log in as analyst for any credentials
      login('analyst_l1')
      navigate('/2fa')
    }

    setLoading(false)
  }

  const handleQuickLogin = (account: DemoAccount) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: isDark ? '#07101a' : '#f4f7fa',
      }}
    >
      {/* ═══════════ LEFT PANEL — BRANDING ═══════════ */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          width: '48%',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #06101c 0%, #0c1e34 40%, #0a1829 100%)',
          p: 6,
        }}
      >
        {/* Glow effects */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: '20%',
            flex: 1,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(41,182,246,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            flex: 1,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand */}
        <Stack spacing={1} sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <ShieldIcon sx={{ fontSize: 40, color: '#29b6f6' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '0.5px',
              }}
            >
              CYBEROPS360
            </Typography>
          </Stack>

          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              lineHeight: 1.25,
              maxWidth: 500,
              mb: 1.5,
              mt: 4,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            The Command Center for <Box component="span" sx={{ color: '#29b6f6' }}>Modern CyberOps</Box>
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 450,
              lineHeight: 1.7,
              mb: 4,
              fontSize: '0.95rem',
            }}
          >
            Manage incidents, track compliance, assess risks, and monitor SLA performance — all from one powerful platform.
          </Typography>

          {/* Feature grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5, maxWidth: 640 }}>
            {features.map((f) => (
              <Box
                key={f.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  width: 'calc(50% - 8px)',
                  boxSizing: 'border-box',
                }}
              >
                <Box sx={{ color: '#29b6f6', display: 'flex', mr: 1.5, '& > svg': { fontSize: 20 } }}>
                  {f.icon}
                </Box>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, fontSize: '0.85rem' }}>
                  {f.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Stats */}
          <Stack
            direction="row"
            spacing={4}
            sx={{
              pt: 2,
            }}
          >
            {stats.map((s) => (
              <Box key={s.label}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>
                  {s.value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* ═══════════ RIGHT PANEL — LOGIN FORM ═══════════ */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile brand */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ display: { xs: 'flex', lg: 'none' }, mb: 4 }}
          >
            <ShieldIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              CyberOps360
            </Typography>
          </Stack>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ mb: 4 }}>
            Sign in to access your security operations console.
          </Typography>

          {/* Error display */}
          {error && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.25)}`,
              }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.error.main, fontWeight: 500 }}>
                {error}
              </Typography>
            </Box>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                id="login-email"
                label="Email address"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon sx={{ fontSize: 20 }} />
                          ) : (
                            <VisibilityIcon sx={{ fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      Remember me
                    </Typography>
                  }
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Forgot password?
                </Typography>
              </Stack>

              <Button
                id="login-submit"
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                endIcon={!loading && <ArrowIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 2,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </form>

          {/* Demo accounts */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
              QUICK DEMO ACCESS
            </Typography>
          </Divider>

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            justifyContent="center"
          >
            {demoAccounts.map((account) => (
              <Button
                key={account.role}
                id={`demo-${account.role}`}
                variant="outlined"
                size="small"
                onClick={() => handleQuickLogin(account)}
                sx={{
                  borderColor: alpha(account.color, 0.35),
                  color: account.color,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  px: 2,
                  py: 0.75,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: account.color,
                    bgcolor: alpha(account.color, 0.08),
                  },
                }}
              >
                {account.label}
              </Button>
            ))}
          </Stack>

          {/* Security note */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 4, opacity: 0.5 }}
          >
            <CheckIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">
              256-bit SSL encrypted • SOC 2 compliant
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

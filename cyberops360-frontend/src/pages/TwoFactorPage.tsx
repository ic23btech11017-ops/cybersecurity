import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  alpha,
  useTheme,
} from '@mui/material'
import { Lock as LockIcon, Shield as ShieldIcon, VpnKey as KeyIcon } from '@mui/icons-material'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useState } from 'react'

export const TwoFactorPage = () => {
  const { isAuthenticated, isTwoFactorVerified, verifyTwoFactor } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('123456')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isTwoFactorVerified) {
    return <Navigate to="/dashboard" replace />
  }

  const handleVerify = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    verifyTwoFactor()
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 3,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440, overflow: 'visible' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Icon */}
          <Box
            sx={{
              flex: 1,
              height: 56,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <LockIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Two-Factor Verification
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter the six-digit code from your authenticator app to continue.
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              id="2fa-code"
              label="One-time code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  maxLength: 6,
                  style: {
                    letterSpacing: '0.3em',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                  },
                },
              }}
            />
            <Button
              id="2fa-submit"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleVerify}
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem', borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify & Open Console'}
            </Button>
          </Stack>

          {/* Hint */}
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ mt: 3, opacity: 0.5 }}>
            <ShieldIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">
              Demo: any 6-digit code works
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

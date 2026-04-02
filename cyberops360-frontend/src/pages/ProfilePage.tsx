import { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material'
import {
  Email,
  Phone,
  Badge,
  CalendarMonth,
  Security,
  Edit as EditIcon,
} from '@mui/icons-material'
import { PageContainer } from '../components/PageContainer'
import { KpiCard } from '../components/KpiCard'
import { CrudDialog } from '../components/CrudDialog'
import { useSnackbar } from '../components/SnackbarProvider'
import { useAuth } from '../auth/AuthContext'

export const ProfilePage = () => {
  const { role } = useAuth()
  const theme = useTheme()
  const { showSnackbar } = useSnackbar()

  const roleName = role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const initials = role
    .split('_')
    .map((w) => w[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({
    fullName: roleName,
    email: `${role}@cyberops360.io`,
    phone: '+91 98765 43210',
    department: 'Security Operations Center',
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    setLoading(false)
    setEditOpen(false)
    showSnackbar('Profile updated successfully')
  }

  const profileKpis = [
    { label: 'Incidents Handled', value: '47', delta: '+8 this week', color: '#3b82f6', icon: <Security /> },
    { label: 'Avg Response Time', value: '12m', delta: '-3m vs last month', color: '#14b8a6', icon: <CalendarMonth /> },
    { label: 'Active Sessions', value: '2', delta: 'Mumbai, Delhi', color: '#f59e0b', icon: <Badge /> },
    { label: 'Last Login', value: '2h ago', delta: 'Chrome on Windows', color: '#8b5cf6', icon: <Email /> },
  ]

  return (
    <PageContainer title="My Profile" subtitle="Manage your account settings, preferences, and session history.">
      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  flex: 1,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                }}
              >
                {initials}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {form.fullName}
              </Typography>
              <Chip
                label={roleName}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mt: 1, fontWeight: 600 }}
              />
              <Divider sx={{ my: 2.5 }} />
              <Stack spacing={1.5} alignItems="flex-start" sx={{ px: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Email sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">{form.email}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">{form.phone}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Badge sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="body2">{form.department}</Typography>
                </Stack>
              </Stack>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mt: 3 }}
                fullWidth
                onClick={() => setEditOpen(true)}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* KPIs + Activity */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={2}>
            {profileKpis.map((kpi) => (
              <Grid size={{ xs: 12, sm: 6 }} key={kpi.label}>
                <KpiCard {...kpi} />
              </Grid>
            ))}
          </Grid>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Stack spacing={1.5} divider={<Divider />}>
                {[
                  { action: 'Resolved incident INC-1071', time: '2 hours ago', type: 'success' },
                  { action: 'Escalated INC-1063 to L3', time: '4 hours ago', type: 'warning' },
                  { action: 'Updated risk RSK-385 treatment', time: '6 hours ago', type: 'info' },
                  { action: 'Uploaded evidence ev-1042', time: '1 day ago', type: 'info' },
                  { action: 'Generated Executive Security Summary', time: '1 day ago', type: 'success' },
                  { action: 'Updated SLA targets for NorthGrid', time: '2 days ago', type: 'info' },
                  { action: 'Created invoice INV-2210', time: '3 days ago', type: 'success' },
                ].map((item, idx) => (
                  <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">{item.action}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', ml: 2 }}>
                      {item.time}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <CrudDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        title="Edit Profile"
        onSubmit={handleSave}
        loading={loading}
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              label="Full Name"
              fullWidth
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Phone"
              fullWidth
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Department"
              fullWidth
              value={form.department}
              onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
            />
          </Grid>
        </Grid>
      </CrudDialog>
    </PageContainer>
  )
}

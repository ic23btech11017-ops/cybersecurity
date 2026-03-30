import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, Stack, Typography, useTheme } from '@mui/material'
import {
  BugReport,
  Assessment,
  GppGood,
  Speed,
  AddCircleOutline,
  OpenInNew,
  PlaylistAddCheck,
  Summarize,
  Groups,
  Shield,
  ReceiptLong,
  Storage,
} from '@mui/icons-material'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  Cell,
  Bar,
  BarChart,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/PageContainer'
import { KpiCard } from '../components/KpiCard'
import { cfmsService } from '../services/mock/cfmsService'
import type { Kpi } from '../types/cfms'

const incidentsTrend = [
  { day: 'Mon', value: 19 },
  { day: 'Tue', value: 15 },
  { day: 'Wed', value: 12 },
  { day: 'Thu', value: 21 },
  { day: 'Fri', value: 14 },
  { day: 'Sat', value: 9 },
  { day: 'Sun', value: 11 },
]

const riskMix = [
  { name: 'Critical', value: 5, color: '#ef4444' },
  { name: 'High', value: 9, color: '#f59e0b' },
  { name: 'Medium', value: 11, color: '#14b8a6' },
  { name: 'Low', value: 6, color: '#38bdf8' },
]

const complianceTrend = [
  { month: 'Sep', iso: 65, soc: 50 },
  { month: 'Oct', iso: 70, soc: 58 },
  { month: 'Nov', iso: 78, soc: 65 },
  { month: 'Dec', iso: 82, soc: 72 },
  { month: 'Jan', iso: 88, soc: 80 },
  { month: 'Feb', iso: 92, soc: 85 },
]

const kpiIcons = [
  <BugReport />,
  <Assessment />,
  <GppGood />,
  <Speed />,
]

const kpiColors = ['#3b82f6', '#f59e0b', '#14b8a6', '#8b5cf6']
const kpiPaths = ['/incidents', '/incidents', '/compliance', '/risks']

export const DashboardPage = () => {
  const [kpis, setKpis] = useState<Kpi[]>([])
  const theme = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    cfmsService.getKpis().then(setKpis)
  }, [])

  const quickActions = [
    { label: 'Report Incident', icon: <AddCircleOutline />, path: '/incidents' },
    { label: 'View Risks', icon: <OpenInNew />, path: '/risks' },
    { label: 'Compliance Check', icon: <PlaylistAddCheck />, path: '/compliance' },
    { label: 'Generate Report', icon: <Summarize />, path: '/reports' },
    { label: 'Manage Clients', icon: <Groups />, path: '/clients' },
    { label: 'Asset Inventory', icon: <Storage />, path: '/assets' },
    { label: 'Billing & Invoices', icon: <ReceiptLong />, path: '/billing' },
    { label: 'SLA Dashboard', icon: <Shield />, path: '/sla' },
  ]

  return (
    <PageContainer
      title="Security Analytics"
      subtitle="Live posture summary across incidents, SLA, risk and compliance readiness."
    >
      <Grid container spacing={2}>
        {/* KPI Cards — clickable */}
        {kpis.map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={kpi.label}>
            <KpiCard
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              color={kpiColors[idx % kpiColors.length]}
              icon={kpiIcons[idx % kpiIcons.length]}
              onClick={() => navigate(kpiPaths[idx % kpiPaths.length])}
            />
          </Grid>
        ))}

        {/* Incident Trend Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Incident Trend (7 days)
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={incidentsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="day" stroke={theme.palette.text.secondary} fontSize={12} />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Incidents" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Distribution Pie */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Risk Distribution
              </Typography>
              <Stack sx={{ height: 280 }} alignItems="center" justifyContent="center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskMix} dataKey="value" nameKey="name" outerRadius={88} innerRadius={45} paddingAngle={2}>
                      {riskMix.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Compliance Trend */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Compliance Progress (6 months)
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={complianceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} fontSize={12} />
                  <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="iso" name="ISO 27001" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="soc" name="SOC 2" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack spacing={1}>
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outlined"
                    fullWidth
                    startIcon={action.icon}
                    onClick={() => navigate(action.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 500,
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

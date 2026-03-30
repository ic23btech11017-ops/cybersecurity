import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
  LinearProgress,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  BugReport as IncidentIcon,
  Person as AnalystIcon,
  AccessTime as TimeIcon,
  Computer as AssetIcon,
  Business as ClientIcon,
  Shield as ShieldIcon,
  GppBad as GppBadIcon,
} from '@mui/icons-material'
import { PageContainer } from '../components/PageContainer'
import { cfmsService } from '../services/mock/cfmsService'
import type { Incident } from '../types/cfms'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`incident-tabpanel-${index}`}
      aria-labelledby={`incident-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export const IncidentDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    const fetchIncident = async () => {
      const incidents = await cfmsService.getIncidents()
      const found = incidents.find(i => i.id === id) || null
      setIncident(found)
      setLoading(false)
    }
    fetchIncident()
  }, [id])

  if (loading) {
    return (
      <PageContainer title="Loading..." subtitle="">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    )
  }

  if (!incident) {
    return (
      <PageContainer title="Incident Not Found" subtitle="">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/incidents')}>
          Back to Incidents
        </Button>
        <Typography sx={{ mt: 4 }}>The incident with ID {id} could not be found.</Typography>
      </PageContainer>
    )
  }

  // Mock data calculations
  const totalSla = 240 // Assuming 4 hours total SLA
  const slaRemaining = incident.slaMinutesRemaining
  const slaProgress = Math.max(0, Math.min(100, ((totalSla - slaRemaining) / totalSla) * 100))
  const isSlaBreached = slaRemaining < 0

  return (
    <PageContainer title="Incident Forensic Workspace" subtitle={`Incident Tracking and SLA Details for ${incident.id}`}>
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/incidents')}
          sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
        >
          Back to Incidents
        </Button>
      </Box>

      {/* Hero Card */}
      <Card sx={{ mb: 3, pt: 3, px: 3, pb: 0, borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#141c2c' : '#fff' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box 
              sx={{ 
                flex: 1, 
                height: 72, 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: incident.severity === 'Critical' ? alpha('#ef4444', 0.1) : incident.severity === 'High' ? alpha('#f59e0b', 0.1) : alpha('#3b82f6', 0.1), 
                color: incident.severity === 'Critical' ? '#ef4444' : incident.severity === 'High' ? '#f59e0b' : '#3b82f6',
              }}
            >
              <IncidentIcon sx={{ fontSize: 40 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.01em' }}>
                {incident.title}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                  {incident.id}
                </Typography>
                <Chip 
                  label={incident.status} 
                  size="small"
                  variant="outlined"
                  color={incident.status === 'Resolved' || incident.status === 'Closed' ? 'success' : incident.status === 'Escalated' ? 'error' : 'default'} 
                  sx={{ borderRadius: 1 }}
                />
              </Stack>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              label={`${incident.severity} Severity`} 
              color={incident.severity === 'Critical' ? 'error' : incident.severity === 'High' ? 'warning' : 'primary'}
              sx={{ fontWeight: 600, borderRadius: 1 }}
            />
            <Button variant="contained" color={isSlaBreached ? 'error' : 'primary'}>
              {incident.status === 'Resolved' ? 'View RCA' : 'Escalate'}
            </Button>
          </Stack>
        </Stack>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4, mx: -3 }}>
          <Tabs 
            value={tabIndex} 
            onChange={(_, val) => setTabIndex(val)} 
            sx={{
              minHeight: 40,
              '& .MuiTabs-flexContainer': { px: 3 },
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                pt: 0,
              }
            }}
          >
            <Tab label="Forensic Overview" />
            <Tab label="Timeline & Logs" />
            <Tab label="Evidence Vault" />
            <Tab label="Resolution Map" />
          </Tabs>
        </Box>
      </Card>

      {/* Tab Content */}
      <TabPanel value={tabIndex} index={0}>
        <Grid container spacing={3}>
          {/* INCIDENT DETAILS SECTION */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 2, letterSpacing: 1 }}>
              INCIDENT CONTEXT
            </Typography>
            <Card sx={{ borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#141c2c' : '#f8fafc' }}>
              <Stack spacing={0} divider={<Divider />}>
                <DetailRow icon={<AnalystIcon />} label="Assigned Analyst" value={incident.assignedAnalyst} />
                <DetailRow icon={<ClientIcon />} label="Impacted Client" value={incident.clientId} />
                <DetailRow icon={<AssetIcon />} label="Target Asset" value={incident.assetId} />
                <DetailRow icon={<TimeIcon />} label="Time Detected" value={new Date(incident.createdAt).toLocaleString()} />
              </Stack>
            </Card>
          </Grid>

          {/* SLA & FORENSICS SUMMARY SECTION */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 2, letterSpacing: 1 }}>
              SLA & RESPONSE
            </Typography>
            <Card sx={{ borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#141c2c' : '#f8fafc' }}>
               <Stack spacing={0} divider={<Divider />}>
                <DetailRow icon={<ShieldIcon color="primary" />} label="Response Target" value="4 Hours (Standard)" valueWeight={700} />
                <DetailRow 
                  icon={<GppBadIcon color={isSlaBreached ? "error" : "warning"} />} 
                  label="Remaining Time" 
                  value={isSlaBreached ? `Breached by ${Math.abs(slaRemaining)} mins` : `${slaRemaining} mins`} 
                  valueColor={isSlaBreached ? "#ef4444" : "#f59e0b"} 
                />
                
                <Box sx={{ p: 3, pt: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>SLA Time Elapsed</Typography>
                    <Typography variant="caption" sx={{ color: isSlaBreached ? '#ef4444' : '#3b82f6', fontWeight: 600 }}>{slaProgress.toFixed(0)}%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, slaProgress)} 
                    color={isSlaBreached ? 'error' : slaProgress > 75 ? 'warning' : 'primary'} 
                    sx={{ height: 6, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }} 
                  />
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Typography color="text.secondary">Automated IOC tracking and manual intervention logs.</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography color="text.secondary">Pcap files, memory dumps, and syslog exports.</Typography>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <Typography color="text.secondary">Root cause analysis (RCA) and mitigation plan.</Typography>
      </TabPanel>

    </PageContainer>
  )
}

function DetailRow({ icon, label, value, valueColor, valueWeight }: any) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        flex: 1, height: 32, borderRadius: 1.5, 
        bgcolor: (theme) => alpha(theme.palette.mode === 'dark' ? '#fff' : '#000', 0.05),
        color: 'text.secondary',
        mr: 2,
        '& > svg': { fontSize: 18 }
      }}>
        {icon}
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: valueWeight || 600, color: valueColor || 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  )
}

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
  Avatar,
  alpha,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import {
  ArrowBack as ArrowBackIcon,
  BusinessCenter as IndustryIcon,
  Timeline as SlaIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Payment as PaymentIcon,
  CheckCircle as PaidIcon,
  ErrorOutline as PendingIcon,
} from '@mui/icons-material'
import { PageContainer } from '../components/PageContainer'
import { cfmsService } from '../services/mock/cfmsService'
import type { Client, Asset, Invoice } from '../types/cfms'

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

export const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [client, setClient] = useState<Client | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    const fetchClient = async () => {
      const clients = await cfmsService.getClients()
      const found = clients.find(c => c.id === id) || null
      setClient(found)
      
      if (found) {
        const _assets = await cfmsService.getAssets()
        setAssets(_assets.filter(a => a.clientId === id))
        
        const _invoices = await cfmsService.getInvoices()
        setInvoices(_invoices.filter(i => i.clientId === id))
      }
      setLoading(false)
    }
    fetchClient()
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

  if (!client) {
    return (
      <PageContainer title="Client Not Found" subtitle="">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clients')}>
          Back to Clients
        </Button>
        <Typography sx={{ mt: 4 }}>The client with ID {id} could not be found.</Typography>
      </PageContainer>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  // Mocking extended data that isn't strictly in the CFMS Client type
  const mockEmail = `contact@${client.name.toLowerCase().replace(/[\s\W]+/g, '')}.com`
  const mockPhone = '+1 (800) 555-0199'
  const mockDate = '2023-11-14'
  const totalFee = 150000
  const paidFee = 120000
  const pendingFee = totalFee - paidFee
  const paymentProgress = (paidFee / totalFee) * 100

  const assetCols: GridColDef<Asset>[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'ip', headerName: 'IP Address', flex: 1 },
    { field: 'os', headerName: 'OS', flex: 1 },
    { 
      field: 'criticality', 
      headerName: 'Criticality', 
      flex: 1, 
      align: 'center',
      headerAlign: 'center',
      renderCell: (p) => <Chip label={p.value} size="small" color={p.value === 'Critical' ? 'error' : p.value === 'High' ? 'warning' : 'default'} /> 
    },
  ]

  const invoiceCols: GridColDef<Invoice>[] = [
    { field: 'id', headerName: 'Invoice', flex: 1 },
    { field: 'plan', headerName: 'Plan', flex: 1 },
    { field: 'amountUsd', headerName: 'Amount', flex: 1, valueGetter: (_v, row) => `$${row.amountUsd.toLocaleString()}` },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1, 
      align: 'center',
      headerAlign: 'center',
      renderCell: (p) => <Chip label={p.value} size="small" variant="outlined" color={p.value === 'Paid' ? 'success' : 'default'} /> 
    },
  ]

  return (
      <PageContainer title="Client Details" subtitle="Detailed overview and SLA status for the selected client.">
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/clients')}
          sx={{ color: 'text.secondary', textTransform: 'none', '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
        >
          Back to Clients
        </Button>
      </Box>

      {/* Hero Card */}
      <Card sx={{ mb: 3, p: 3, borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#141c2c' : '#fff' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar 
              sx={{ 
                width: 72, 
                height: 72, 
                bgcolor: 'primary.main', 
                fontSize: '1.75rem', 
                fontWeight: 700,
                boxShadow: (theme) => `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
              }}
            >
              {getInitials(client.name)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.01em' }}>
                {client.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontFamily: 'monospace' }}>
                {client.id}
              </Typography>
              <Stack direction="row" spacing={3} sx={{ color: 'text.secondary' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{mockEmail}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">{mockPhone}</Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              label={client.slaStatus === 'Healthy' ? 'SLA Green' : client.slaStatus === 'Watch' ? 'SLA Yellow' : 'SLA Breach'} 
              color={client.slaStatus === 'Healthy' ? 'success' : client.slaStatus === 'Watch' ? 'warning' : 'error'}
              sx={{ fontWeight: 600, borderRadius: 1 }}
            />
            <Button variant="contained" color="primary">
              Review Escrow
            </Button>
          </Stack>
        </Stack>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs 
            value={tabIndex} 
            onChange={(_, val) => setTabIndex(val)} 
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                pt: 0,
                px: 3,
              }
            }}
          >
            <Tab label="Overview" />
            <Tab label="Assets & Network" />
            <Tab label="Contracts & Billing" />
            <Tab label="Stakeholders" />
          </Tabs>
        </Box>
      </Card>

      {/* Tab Content */}
      <TabPanel value={tabIndex} index={0}>
        <Grid container spacing={3}>
          {/* CLIENT DETAILS SECTION */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 2, letterSpacing: 1 }}>
              CLIENT DETAILS
            </Typography>
            <Card sx={{ borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#141c2c' : '#f8fafc' }}>
              <Stack spacing={0} divider={<Divider />}>
                <DetailRow icon={<IndustryIcon />} label="Industry Sector" value={client.industry} />
                <DetailRow icon={<SlaIcon />} label="SLA Monitoring" value={`${client.slaStatus} State`} valueColor={client.slaStatus === 'Healthy' ? '#10b981' : client.slaStatus === 'Watch' ? '#f59e0b' : '#ef4444'} />
                <DetailRow icon={<CalendarIcon />} label="Date Onboarded" value={mockDate} />
                <DetailRow icon={<EmailIcon />} label="Active Incidents" value={`${client.activeIncidents} Open Cases`} />
              </Stack>
            </Card>
          </Grid>

          {/* SLA & BILLING SUMMARY SECTION */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, mb: 2, letterSpacing: 1 }}>
              FEE SUMMARY
            </Typography>
            <Card sx={{ borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#141c2c' : '#f8fafc' }}>
               <Stack spacing={0} divider={<Divider />}>
                <DetailRow icon={<PaymentIcon color="primary" />} label="Total Retainer" value={`$${totalFee.toLocaleString()}`} valueWeight={700} />
                <DetailRow icon={<PaidIcon color="success" />} label="Paid" value={`$${paidFee.toLocaleString()}`} valueColor="#10b981" />
                <DetailRow icon={<PendingIcon color="error" />} label="Pending" value={`$${pendingFee.toLocaleString()}`} valueColor="#ef4444" />
                
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Payment Progress</Typography>
                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>{paymentProgress.toFixed(0)}%</Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={paymentProgress} 
                    color="success" 
                    sx={{ height: 6, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.success.main, 0.1) }} 
                  />
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Card sx={{ height: 400, borderRadius: 2 }}>
          <DataGrid rows={assets} columns={assetCols} hideFooter disableRowSelectionOnClick />
        </Card>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Card sx={{ height: 400, borderRadius: 2 }}>
          <DataGrid rows={invoices} columns={invoiceCols} hideFooter disableRowSelectionOnClick />
        </Card>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <Card sx={{ borderRadius: 2 }}>
          <List>
            {['Sarah Jenkins (CISO)', 'Marcus Thorne (Lead Engineer)', 'Jessica Park (Emergency POC)'].map((name, i) => (
              <ListItem key={i} divider={i < 2}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main', fontSize: '0.8rem', fontWeight: 700 }}>{name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} secondary={`${name.split(' ')[0].toLowerCase()}@${client.name.toLowerCase().replace(/[\s\W]+/g, '')}.com`} />
              </ListItem>
            ))}
          </List>
        </Card>
      </TabPanel>

    </PageContainer>
  )
}

function DetailRow({ icon, label, value, valueColor, valueWeight }: any) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      <Box sx={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        width: 32, height: 32, borderRadius: 1.5, 
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

import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { Add as AddIcon, Upload as UploadIcon, Summarize as ReportIcon } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageContainer } from '../components/PageContainer'
import { ActionButtons } from '../components/ActionButtons'
import { CrudDialog } from '../components/CrudDialog'
import { useSnackbar } from '../components/SnackbarProvider'

/* ═════════════════════════════════════════════════════════
 *  SOC Queue
 * ═════════════════════════════════════════════════════════ */
const queueRowsInit = [
  { id: 'L1 Triage', incidents: 45, avgAge: '12m', analysts: 8, hot: 5 },
  { id: 'L2 Investigation', incidents: 22, avgAge: '45m', analysts: 6, hot: 8 },
  { id: 'L3 Escalation', incidents: 8, avgAge: '120m', analysts: 3, hot: 4 },
  { id: 'Threat Intel', incidents: 3, avgAge: '24h', analysts: 2, hot: 1 },
  { id: 'Forensics', incidents: 1, avgAge: '48h', analysts: 1, hot: 0 },
]

const queueLoad = [
  { level: 'L1', load: 45 },
  { level: 'L2', load: 22 },
  { level: 'L3', load: 8 },
  { level: 'Threat', load: 3 },
  { level: 'Forensics', load: 1 },
]

export const SocQueuePage = () => {
  const [rows, setRows] = useState(queueRowsInit)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = useState<(typeof rows)[number] | null>(null)
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view')
  const [form, setForm] = useState({ incidents: 0, avgAge: '', analysts: 0, hot: 0 })
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()

  const openView = (r: (typeof rows)[number]) => { setDialogMode('view'); setSelected(r); setDialogOpen(true) }
  const openEdit = (r: (typeof rows)[number]) => {
    setDialogMode('edit')
    setForm({ incidents: r.incidents, avgAge: r.avgAge, analysts: r.analysts, hot: r.hot })
    setSelected(r)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    if (selected) {
      setRows((prev) => prev.map((r) => r.id === selected.id ? { ...r, ...form } : r))
      showSnackbar('Queue updated')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'Queue', flex: 1,  },
    { field: 'incidents', headerName: 'Open', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'analysts', headerName: 'Analysts', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'avgAge', headerName: 'Avg Age', flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: 'hot',
      headerName: 'Escalations',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Chip size="small" color={params.value > 2 ? 'error' : 'warning'} label={`${params.value}`} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => <ActionButtons onView={() => openView(params.row)} onEdit={() => openEdit(params.row)} />,
    },
  ]

  return (
    <PageContainer title="SOC Queue" subtitle="L1/L2/L3 queues with incident load, analyst balance, and escalation markers.">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ height: 360 }}>
            <DataGrid 
              rows={rows} 
              columns={columns} 
              hideFooter 
              disableRowSelectionOnClick 
              onRowClick={(params) => openView(params.row)}
              sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Queue Pressure</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={queueLoad}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="load" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CrudDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        title={dialogMode === 'view' ? 'Queue Details' : 'Edit Queue'}
        onSubmit={handleSubmit}
        loading={loading}
      >
        {dialogMode === 'view' && selected ? (
          <Stack spacing={2}>
            {Object.entries(selected).map(([k, v]) => (
              <Box key={k}><Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{v}</Typography></Box>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Open Incidents" fullWidth type="number" value={form.incidents} onChange={(e) => setForm((p) => ({ ...p, incidents: Number(e.target.value) }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Avg Age" fullWidth value={form.avgAge} onChange={(e) => setForm((p) => ({ ...p, avgAge: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Analysts" fullWidth type="number" value={form.analysts} onChange={(e) => setForm((p) => ({ ...p, analysts: Number(e.target.value) }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Escalations" fullWidth type="number" value={form.hot} onChange={(e) => setForm((p) => ({ ...p, hot: Number(e.target.value) }))} /></Grid>
          </Grid>
        )}
      </CrudDialog>
    </PageContainer>
  )
}

/* ═════════════════════════════════════════════════════════
 *  Evidence
 * ═════════════════════════════════════════════════════════ */
const evidenceInit = [
  { id: 'ev-1004', control: 'A.5.1', tag: 'Policy', version: 'v2.1', audit: 'Internal Q1', status: 'Approved' },
  { id: 'ev-1028', control: 'A.8.9', tag: 'Config', version: 'v1.4', audit: 'Internal Q1', status: 'Pending' },
  { id: 'ev-1042', control: 'A.5.28', tag: 'Logs', version: 'v3.0', audit: 'External Prep', status: 'Approved' },
  { id: 'ev-1055', control: 'A.7.1', tag: 'Screenshot', version: 'v1.0', audit: 'ISO 27001 Re-cert', status: 'Pending' },
  { id: 'ev-1061', control: 'A.8.1', tag: 'Report', version: 'v2.2', audit: 'SOC 2 Type II', status: 'Approved' },
  { id: 'ev-1070', control: 'CC6.1', tag: 'Config', version: 'v4.1', audit: 'SOC 2 Type II', status: 'Approved' },
  { id: 'ev-1084', control: 'CC6.2', tag: 'Logs', version: 'v1.0', audit: 'Internal Q2', status: 'Pending' },
  { id: 'ev-1099', control: 'CC8.1', tag: 'Policy', version: 'v5.0', audit: 'External Prep', status: 'Approved' },
]

export const EvidencePage = () => {
  const [rows, setRows] = useState(evidenceInit)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [selected, setSelected] = useState<(typeof rows)[number] | null>(null)
  const [form, setForm] = useState({ control: '', tag: '', version: '', audit: '', status: 'Pending' })
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()

  const openCreate = () => { setDialogMode('create'); setForm({ control: '', tag: '', version: '', audit: '', status: 'Pending' }); setSelected(null); setDialogOpen(true) }
  const openView = (r: (typeof rows)[number]) => { setDialogMode('view'); setSelected(r); setDialogOpen(true) }
  const openEdit = (r: (typeof rows)[number]) => { setDialogMode('edit'); setForm({ ...r }); setSelected(r); setDialogOpen(true) }
  const openDelete = (r: (typeof rows)[number]) => { setDialogMode('delete'); setSelected(r); setDialogOpen(true) }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    if (dialogMode === 'create') {
      setRows((p) => [{ ...form, id: `ev-${Date.now()}` }, ...p])
      showSnackbar('Evidence uploaded successfully')
    } else if (dialogMode === 'edit' && selected) {
      setRows((p) => p.map((r) => r.id === selected.id ? { ...r, ...form } : r))
      showSnackbar('Evidence updated')
    } else if (dialogMode === 'delete' && selected) {
      setRows((p) => p.filter((r) => r.id !== selected.id))
      showSnackbar('Evidence deleted', 'error')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'Evidence ID', width: 130 },
    { field: 'control', headerName: 'Control', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'tag', headerName: 'Tag', width: 130 },
    { field: 'version', headerName: 'Version', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'audit', headerName: 'Audit', flex: 1,  },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Chip size="small" color={params.value === 'Approved' ? 'success' : 'warning'} label={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => <ActionButtons onView={() => openView(params.row)} onEdit={() => openEdit(params.row)} onDelete={() => openDelete(params.row)} />,
    },
  ]

  return (
    <PageContainer title="Evidence Vault" subtitle="Control-linked evidence catalog with audit-friendly lifecycle visibility.">
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="outlined" onClick={() => showSnackbar('Audit bundle exported', 'info')}>Export Audit Bundle</Button>
          <Button variant="contained" startIcon={<UploadIcon />} onClick={openCreate}>Upload Evidence</Button>
        </Stack>
        <Paper sx={{ height: 420 }}>
          <DataGrid 
            rows={rows} 
            columns={columns} 
            disableRowSelectionOnClick 
            onRowClick={(params) => openView(params.row)}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          />
        </Paper>
      </Stack>

      <CrudDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        title={dialogMode === 'create' ? 'Upload Evidence' : dialogMode === 'edit' ? 'Edit Evidence' : dialogMode === 'view' ? 'Evidence Details' : 'Delete Evidence'}
        onSubmit={handleSubmit}
        loading={loading}
        deleteName={selected?.id}
      >
        {dialogMode === 'view' && selected ? (
          <Stack spacing={2}>
            {Object.entries(selected).map(([k, v]) => (
              <Box key={k}><Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{v}</Typography></Box>
            ))}
          </Stack>
        ) : (dialogMode === 'create' || dialogMode === 'edit') ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Control" fullWidth value={form.control} onChange={(e) => setForm((p) => ({ ...p, control: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Tag" fullWidth select value={form.tag} onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}>
              {['Policy', 'Config', 'Logs', 'Screenshot', 'Report'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Version" fullWidth value={form.version} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Audit" fullWidth value={form.audit} onChange={(e) => setForm((p) => ({ ...p, audit: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Status" fullWidth select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              <MenuItem value="Pending">Pending</MenuItem><MenuItem value="Approved">Approved</MenuItem></TextField></Grid>
          </Grid>
        ) : null}
      </CrudDialog>
    </PageContainer>
  )
}

/* ═════════════════════════════════════════════════════════
 *  Reports
 * ═════════════════════════════════════════════════════════ */
const reportInit = [
  { id: 'rep-701', name: 'Executive Security Summary', cadence: 'Weekly', owner: 'SOC Lead', state: 'Ready' },
  { id: 'rep-715', name: 'Compliance Completion', cadence: 'Bi-weekly', owner: 'GRC Manager', state: 'Draft' },
  { id: 'rep-730', name: 'Incident Root Cause Digest', cadence: 'Monthly', owner: 'L3 Team', state: 'Ready' },
  { id: 'rep-744', name: 'Vulnerability Patch Status', cadence: 'Weekly', owner: 'Infra Lead', state: 'Ready' },
  { id: 'rep-758', name: 'SLA Breach Analysis', cadence: 'Monthly', owner: 'Service Delivery', state: 'Draft' },
  { id: 'rep-762', name: 'Cloud Infrastructure Health', cadence: 'Daily', owner: 'CloudOps', state: 'Ready' },
  { id: 'rep-781', name: 'Phishing Campaign Results', cadence: 'Quarterly', owner: 'Awareness Team', state: 'Draft' },
]

const reportMix = [
  { name: 'Incident', value: 45, color: '#0ea5e9' },
  { name: 'Risk', value: 30, color: '#f59e0b' },
  { name: 'Compliance', value: 25, color: '#14b8a6' },
]

export const ReportsPage = () => {
  const [rows, setRows] = useState(reportInit)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [selected, setSelected] = useState<(typeof rows)[number] | null>(null)
  const [form, setForm] = useState({ name: '', cadence: 'Weekly', owner: '', state: 'Draft' })
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()

  const openCreate = () => { setDialogMode('create'); setForm({ name: '', cadence: 'Weekly', owner: '', state: 'Draft' }); setSelected(null); setDialogOpen(true) }
  const openView = (r: (typeof rows)[number]) => { setDialogMode('view'); setSelected(r); setDialogOpen(true) }
  const openEdit = (r: (typeof rows)[number]) => { setDialogMode('edit'); setForm({ ...r }); setSelected(r); setDialogOpen(true) }
  const openDelete = (r: (typeof rows)[number]) => { setDialogMode('delete'); setSelected(r); setDialogOpen(true) }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    if (dialogMode === 'create') {
      setRows((p) => [{ ...form, id: `rep-${Date.now()}` }, ...p])
      showSnackbar('Report template created')
    } else if (dialogMode === 'edit' && selected) {
      setRows((p) => p.map((r) => r.id === selected.id ? { ...r, ...form } : r))
      showSnackbar('Report updated')
    } else if (dialogMode === 'delete' && selected) {
      setRows((p) => p.filter((r) => r.id !== selected.id))
      showSnackbar('Report deleted', 'error')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'name', headerName: 'Report', flex: 1,  },
    { field: 'cadence', headerName: 'Cadence', width: 130 },
    { field: 'owner', headerName: 'Owner', width: 150 },
    {
      field: 'state',
      headerName: 'State',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Chip size="small" color={params.value === 'Ready' ? 'success' : 'default'} label={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => <ActionButtons onView={() => openView(params.row)} onEdit={() => openEdit(params.row)} onDelete={() => openDelete(params.row)} />,
    },
  ]

  return (
    <PageContainer title="Reports" subtitle="Executive and operational reporting workflows with delivery state visibility.">
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" startIcon={<ReportIcon />} onClick={openCreate}>Generate Report</Button>
        </Stack>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ height: 380 }}>
              <DataGrid 
                rows={rows} 
                columns={columns} 
                hideFooter 
                disableRowSelectionOnClick 
                onRowClick={(params) => openView(params.row)}
                sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Report Mix</Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={reportMix} dataKey="value" nameKey="name" outerRadius={92}>
                      {reportMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>

      <CrudDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        title={dialogMode === 'create' ? 'Create Report Template' : dialogMode === 'edit' ? 'Edit Report' : dialogMode === 'view' ? 'Report Details' : 'Delete Report'}
        onSubmit={handleSubmit}
        loading={loading}
        deleteName={selected?.name}
      >
        {dialogMode === 'view' && selected ? (
          <Stack spacing={2}>
            {Object.entries(selected).map(([k, v]) => (
              <Box key={k}><Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{v}</Typography></Box>
            ))}
          </Stack>
        ) : (dialogMode === 'create' || dialogMode === 'edit') ? (
          <Grid container spacing={2}>
            <Grid size={12}><TextField label="Report Name" fullWidth value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Cadence" fullWidth select value={form.cadence} onChange={(e) => setForm((p) => ({ ...p, cadence: e.target.value }))}>
              {['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Owner" fullWidth value={form.owner} onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="State" fullWidth select value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}>
              <MenuItem value="Draft">Draft</MenuItem><MenuItem value="Ready">Ready</MenuItem></TextField></Grid>
          </Grid>
        ) : null}
      </CrudDialog>
    </PageContainer>
  )
}

/* ═════════════════════════════════════════════════════════
 *  SLA Tracking
 * ═════════════════════════════════════════════════════════ */
const slaInit = [
  { id: 'NorthGrid', response: 96, resolution: 93, breaches: 2 },
  { id: 'Helio MedTech', response: 98, resolution: 97, breaches: 1 },
  { id: 'Portline Energy', response: 91, resolution: 88, breaches: 4 },
  { id: 'Axion Technologies', response: 99, resolution: 98, breaches: 0 },
  { id: 'SteelForge Mfg', response: 94, resolution: 90, breaches: 3 },
  { id: 'CrownRetail Group', response: 97, resolution: 95, breaches: 1 },
  { id: 'Meridian Logistics', response: 88, resolution: 85, breaches: 6 },
  { id: 'Prism Pharma Ltd', response: 99, resolution: 99, breaches: 0 },
]

const slaTrend = [
  { week: 'W1', compliance: 89 },
  { week: 'W2', compliance: 92 },
  { week: 'W3', compliance: 95 },
  { week: 'W4', compliance: 94 },
]

export const SlaPage = () => {
  const [rows, setRows] = useState(slaInit)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view')
  const [selected, setSelected] = useState<(typeof rows)[number] | null>(null)
  const [form, setForm] = useState({ response: 0, resolution: 0, breaches: 0 })
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()

  const openView = (r: (typeof rows)[number]) => { setDialogMode('view'); setSelected(r); setDialogOpen(true) }
  const openEdit = (r: (typeof rows)[number]) => {
    setDialogMode('edit')
    setForm({ response: r.response, resolution: r.resolution, breaches: r.breaches })
    setSelected(r)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    if (selected) {
      setRows((p) => p.map((r) => r.id === selected.id ? { ...r, ...form } : r))
      showSnackbar('SLA targets updated')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'Client', flex: 1,  },
    {
      field: 'response',
      headerName: 'Response SLA',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
          <LinearProgress value={params.value} variant="determinate" sx={{ flex: 1 }} />
          <Typography variant="caption">{params.value}%</Typography>
        </Stack>
      ),
    },
    {
      field: 'resolution',
      headerName: 'Resolution SLA',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
          <LinearProgress color="success" value={params.value} variant="determinate" sx={{ flex: 1 }} />
          <Typography variant="caption">{params.value}%</Typography>
        </Stack>
      ),
    },
    {
      field: 'breaches',
      headerName: 'Breaches',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <Chip size="small" label={`${params.value}`} color={params.value > 2 ? 'error' : 'default'} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params) => <ActionButtons onView={() => openView(params.row)} onEdit={() => openEdit(params.row)} />,
    },
  ]

  return (
    <PageContainer title="SLA Tracking" subtitle="Response and resolution SLA performance with breach trend monitoring.">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ height: 360 }}>
            <DataGrid 
              rows={rows} 
              columns={columns} 
              hideFooter 
              disableRowSelectionOnClick 
              onRowClick={(params) => openView(params.row)}
              sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Monthly SLA Compliance</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={slaTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="compliance" stroke="#14b8a6" fill="#14b8a633" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CrudDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        title={dialogMode === 'view' ? 'SLA Details' : 'Edit SLA Targets'}
        onSubmit={handleSubmit}
        loading={loading}
      >
        {dialogMode === 'view' && selected ? (
          <Stack spacing={2}>
            {Object.entries({ Client: selected.id, 'Response SLA': `${selected.response}%`, 'Resolution SLA': `${selected.resolution}%`, Breaches: String(selected.breaches) }).map(([k, v]) => (
              <Box key={k}><Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{v}</Typography></Box>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Response SLA (%)" fullWidth type="number" value={form.response} onChange={(e) => setForm((p) => ({ ...p, response: Number(e.target.value) }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Resolution SLA (%)" fullWidth type="number" value={form.resolution} onChange={(e) => setForm((p) => ({ ...p, resolution: Number(e.target.value) }))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Breaches" fullWidth type="number" value={form.breaches} onChange={(e) => setForm((p) => ({ ...p, breaches: Number(e.target.value) }))} /></Grid>
          </Grid>
        )}
      </CrudDialog>
    </PageContainer>
  )
}

/* ═════════════════════════════════════════════════════════
 *  Settings
 * ═════════════════════════════════════════════════════════ */
export const SettingsPage = () => {
  const { showSnackbar } = useSnackbar()

  const handleSwitch = (label: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    showSnackbar(`${label} ${event.target.checked ? 'enabled' : 'disabled'}`, 'info')
  }

  return (
    <PageContainer title="Settings" subtitle="Profile, preferences, and security operations controls for analysts and admins.">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Notification Policies</Typography>
              <Stack spacing={1}>
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitch('Critical incident push alerts')} />} label="Critical incident push alerts" />
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitch('SLA breach escalation alerts')} />} label="SLA breach escalation alerts" />
                <FormControlLabel control={<Switch onChange={handleSwitch('Daily summary digest')} />} label="Daily summary digest" />
                <FormControlLabel control={<Switch onChange={handleSwitch('Compliance deadline reminders')} />} label="Compliance deadline reminders" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Workspace Preferences</Typography>
              <Stack spacing={1}>
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitch('Dense table layout')} />} label="Dense table layout" />
                <FormControlLabel control={<Switch defaultChecked onChange={handleSwitch('Auto-refresh dashboards')} />} label="Auto-refresh dashboards" />
                <FormControlLabel control={<Switch onChange={handleSwitch('Compact timeline view')} />} label="Compact timeline view" />
                <FormControlLabel control={<Switch onChange={handleSwitch('Dark mode on login page')} />} label="Dark mode on login page" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Security</Typography>
              <Stack spacing={1.5}>
                <Button variant="outlined" fullWidth onClick={() => showSnackbar('Password reset email sent', 'info')}>Change Password</Button>
                <Button variant="outlined" fullWidth onClick={() => showSnackbar('2FA settings opened', 'info')}>Configure 2FA</Button>
                <Button variant="outlined" color="error" fullWidth onClick={() => showSnackbar('All sessions terminated', 'warning')}>Terminate All Sessions</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Data Management</Typography>
              <Stack spacing={1.5}>
                <Button variant="outlined" fullWidth onClick={() => showSnackbar('Export started — check Downloads', 'info')}>Export All Data (CSV)</Button>
                <Button variant="outlined" fullWidth onClick={() => showSnackbar('Audit log downloaded', 'info')}>Download Audit Log</Button>
                <Button variant="outlined" color="error" fullWidth onClick={() => showSnackbar('Cache cleared', 'warning')}>Clear Local Cache</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

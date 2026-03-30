import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { PageContainer } from '../components/PageContainer'
import { useNavigate } from 'react-router-dom'
import { BugReport, AssignmentLate, PendingActions, TaskAlt } from '@mui/icons-material'
import { ActionButtons } from '../components/ActionButtons'
import { KpiCard } from '../components/KpiCard'
import { CrudDialog } from '../components/CrudDialog'
import { useSnackbar } from '../components/SnackbarProvider'
import { cfmsService } from '../services/mock/cfmsService'
import type { Incident } from '../types/cfms'

const blankIncident: Omit<Incident, 'id'> = {
  title: '',
  severity: 'Medium',
  status: 'New',
  assignedAnalyst: '',
  clientId: '',
  assetId: '',
  slaMinutesRemaining: 120,
  createdAt: new Date().toISOString(),
}

export const IncidentsPage = () => {
  const navigate = useNavigate()
  const [rows, setRows] = useState<Incident[]>([])
  const [severity, setSeverity] = useState<'All' | Incident['severity']>('All')
  const [status, setStatus] = useState<'All' | Incident['status']>('All')
  const [query, setQuery] = useState('')
  const { showSnackbar } = useSnackbar()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [selected, setSelected] = useState<Incident | null>(null)
  const [form, setForm] = useState(blankIncident)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cfmsService.getIncidents().then(setRows)
  }, [])

  const filteredRows = useMemo(
    () =>
      rows.filter((i) => {
        const matchSev = severity === 'All' || i.severity === severity
        const matchStat = status === 'All' || i.status === status
        const matchQ = i.title.toLowerCase().includes(query.toLowerCase()) || i.id.toLowerCase().includes(query.toLowerCase())
        return matchSev && matchStat && matchQ
      }),
    [query, rows, severity, status],
  )

  const openCreate = () => { setDialogMode('create'); setForm(blankIncident); setSelected(null); setDialogOpen(true) }
  const openEdit = (i: Incident) => { setDialogMode('edit'); setForm({ ...i }); setSelected(i); setDialogOpen(true) }
  const openDelete = (i: Incident) => { setDialogMode('delete'); setSelected(i); setDialogOpen(true) }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (dialogMode === 'create') {
      setRows((prev) => [{ ...form, id: `INC-${Date.now()}` }, ...prev])
      showSnackbar('Incident reported successfully')
    } else if (dialogMode === 'edit' && selected) {
      setRows((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...form } : r)))
      showSnackbar('Incident updated successfully')
    } else if (dialogMode === 'delete' && selected) {
      setRows((prev) => prev.filter((r) => r.id !== selected.id))
      showSnackbar('Incident deleted', 'error')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const updateForm = (field: string, value: string | number) => setForm((prev) => ({ ...prev, [field]: value }))

  const columns: GridColDef<Incident>[] = [
    { field: 'id', headerName: 'ID', width: 110 },
    { field: 'title', headerName: 'Title', flex: 1,  },
    {
      field: 'severity',
      headerName: 'Severity',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color={params.value === 'Critical' ? 'error' : params.value === 'High' ? 'warning' : 'default'} />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" color={params.value === 'Resolved' || params.value === 'Closed' ? 'success' : params.value === 'Escalated' ? 'error' : 'default'} />
      ),
    },
    { field: 'assignedAnalyst', headerName: 'Analyst', width: 140 },
    {
      field: 'slaMinutesRemaining',
      headerName: 'SLA Timer',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      valueGetter: (_value, row) => `${row.slaMinutesRemaining} min`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtons onView={() => navigate(`/incidents/${params.row.id}`)} onEdit={() => openEdit(params.row)} onDelete={() => openDelete(params.row)} />
      ),
    },
  ]

  return (
    <PageContainer title="Incidents" subtitle="Track and respond to incidents with clear SLA visibility.">
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Total Open" value={rows.filter(r => r.status !== 'Resolved' && r.status !== 'Closed').length.toString()} delta="Active" color="#3b82f6" icon={<BugReport />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Critical/High" value={rows.filter(r => (r.severity === 'Critical' || r.severity === 'High') && r.status !== 'Closed' && r.status !== 'Resolved').length.toString()} delta="Priority" color="#ef4444" icon={<AssignmentLate />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Action Needed" value={rows.filter(r => r.status === 'New' || r.status === 'Escalated').length.toString()} delta="Pending" color="#f59e0b" icon={<PendingActions />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Resolved Today" value={rows.filter(r => r.status === 'Resolved' || r.status === 'Closed').length.toString()} delta="Completed" color="#14b8a6" icon={<TaskAlt />} /></Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField size="small" label="Search incident" value={query} onChange={(e) => setQuery(e.target.value)} sx={{  }} />
            <TextField size="small" select label="Severity" value={severity} onChange={(e) => setSeverity(e.target.value as typeof severity)} sx={{  }}>
              {['All', 'Low', 'Medium', 'High', 'Critical'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
            <TextField size="small" select label="Status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} sx={{  }}>
              {['All', 'New', 'Triage', 'In Progress', 'Escalated', 'Resolved', 'Closed'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Report Incident</Button>
        </Stack>
        <Paper sx={{ height: 560 }}>
          <DataGrid 
            rows={filteredRows} 
            columns={columns} 
            initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }} 
            pageSizeOptions={[5, 10]} 
            disableRowSelectionOnClick 
            onRowClick={(params) => navigate('/incidents/' + params.row.id)}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          />
        </Paper>
      </Stack>

      <CrudDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        title={dialogMode === 'create' ? 'Report New Incident' : dialogMode === 'edit' ? 'Edit Incident' : 'Delete Incident'}
        onSubmit={handleSubmit}
        loading={loading}
        deleteName={selected?.title}
        maxWidth="md"
      >
        {(dialogMode === 'create' || dialogMode === 'edit') ? (
          <Grid container spacing={2}>
            <Grid size={12}><TextField label="Incident Title" fullWidth value={form.title} onChange={(e) => updateForm('title', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Severity" fullWidth select value={form.severity} onChange={(e) => updateForm('severity', e.target.value)}>{['Low', 'Medium', 'High', 'Critical'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Status" fullWidth select value={form.status} onChange={(e) => updateForm('status', e.target.value)}>{['New', 'Triage', 'In Progress', 'Escalated', 'Resolved', 'Closed'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Assigned Analyst" fullWidth value={form.assignedAnalyst} onChange={(e) => updateForm('assignedAnalyst', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="SLA Minutes Remaining" fullWidth type="number" value={form.slaMinutesRemaining} onChange={(e) => updateForm('slaMinutesRemaining', Number(e.target.value))} /></Grid>
          </Grid>
        ) : null}
      </CrudDialog>
    </PageContainer>
  )
}

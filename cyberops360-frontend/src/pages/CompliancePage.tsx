import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { FactCheck, Rule, Policy, VerifiedUser } from '@mui/icons-material'
import { PageContainer } from '../components/PageContainer'
import { ActionButtons } from '../components/ActionButtons'
import { KpiCard } from '../components/KpiCard'
import { CrudDialog } from '../components/CrudDialog'
import { useSnackbar } from '../components/SnackbarProvider'
import { cfmsService } from '../services/mock/cfmsService'
import type { Control } from '../types/cfms'

const blankControl: Omit<Control, 'id'> = {
  framework: 'ISO 27001',
  code: '',
  title: '',
  status: 'Not Started',
}

export const CompliancePage = () => {
  const [controls, setControls] = useState<Control[]>([])
  const [framework, setFramework] = useState<'ISO 27001' | 'SOC 2'>('ISO 27001')
  const [statusFilter, setStatusFilter] = useState<'All' | Control['status']>('All')
  const [query, setQuery] = useState('')
  const { showSnackbar } = useSnackbar()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [selected, setSelected] = useState<Control | null>(null)
  const [form, setForm] = useState(blankControl)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cfmsService.getControls().then(setControls)
  }, [])

  const filtered = useMemo(
    () =>
      controls.filter(
        (c) =>
          c.framework === framework &&
          (statusFilter === 'All' || c.status === statusFilter) &&
          (c.title.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase())),
      ),
    [controls, framework, query, statusFilter],
  )

  const openCreate = () => { setDialogMode('create'); setForm({ ...blankControl, framework }); setSelected(null); setDialogOpen(true) }
  const openEdit = (c: Control) => { setDialogMode('edit'); setForm({ framework: c.framework, code: c.code, title: c.title, status: c.status }); setSelected(c); setDialogOpen(true) }
  const openView = (c: Control) => { setDialogMode('view'); setSelected(c); setDialogOpen(true) }
  const openDelete = (c: Control) => { setDialogMode('delete'); setSelected(c); setDialogOpen(true) }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (dialogMode === 'create') {
      setControls((prev) => [{ ...form, id: `CTL-${Date.now()}` }, ...prev])
      showSnackbar('Control added successfully')
    } else if (dialogMode === 'edit' && selected) {
      setControls((prev) => prev.map((c) => (c.id === selected.id ? { ...c, ...form } : c)))
      showSnackbar('Control updated successfully')
    } else if (dialogMode === 'delete' && selected) {
      setControls((prev) => prev.filter((c) => c.id !== selected.id))
      showSnackbar('Control deleted', 'error')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const columns: GridColDef<Control>[] = [
    { field: 'code', headerName: 'Control', width: 130 },
    { field: 'title', headerName: 'Title', flex: 1,  },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip size="small" label={params.value} color={params.value === 'Done' ? 'success' : params.value === 'In Progress' ? 'warning' : 'default'} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtons onView={() => openView(params.row)} onEdit={() => openEdit(params.row)} onDelete={() => openDelete(params.row)} />
      ),
    },
  ]

  return (
    <PageContainer title="Compliance" subtitle="Framework controls, completion tracking, and audit readiness.">
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Overall Progress" value={`${Math.round((controls.filter(c => c.status === 'Done').length / (controls.length || 1)) * 100)}%`} delta="vs total controls" color="#3b82f6" icon={<FactCheck />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="ISO 27001 Status" value={`${Math.round((controls.filter(c => c.status === 'Done' && c.framework === 'ISO 27001').length / (controls.filter(c => c.framework === 'ISO 27001').length || 1)) * 100)}%`} delta="Compliant" color="#ef4444" icon={<Rule />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="SOC 2 Status" value={`${Math.round((controls.filter(c => c.status === 'Done' && c.framework === 'SOC 2').length / (controls.filter(c => c.framework === 'SOC 2').length || 1)) * 100)}%`} delta="Compliant" color="#f59e0b" icon={<Policy />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Audit Readiness" value="High" delta="Next audit in 45d" color="#14b8a6" icon={<VerifiedUser />} /></Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField size="small" select label="Framework" value={framework} onChange={(e) => setFramework(e.target.value as typeof framework)} sx={{ maxWidth: 220 }}>
              <MenuItem value="ISO 27001">ISO 27001</MenuItem>
              <MenuItem value="SOC 2">SOC 2</MenuItem>
            </TextField>
            <TextField size="small" select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} sx={{ maxWidth: 220 }}>
              {['All', 'Not Started', 'In Progress', 'Done'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </TextField>
            <TextField size="small" label="Search controls" value={query} onChange={(e) => setQuery(e.target.value)} sx={{  }} />
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Add Control</Button>
        </Stack>
        <Paper sx={{ height: 520 }}>
          <DataGrid 
            rows={filtered} 
            columns={columns} 
            initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }} 
            pageSizeOptions={[5, 10]} 
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
        title={dialogMode === 'create' ? 'Add New Control' : dialogMode === 'edit' ? 'Edit Control' : dialogMode === 'view' ? 'Control Details' : 'Delete Control'}
        onSubmit={handleSubmit}
        loading={loading}
        deleteName={selected?.code}
      >
        {dialogMode === 'view' && selected ? (
          <Stack spacing={2}>
            {Object.entries({ ID: selected.id, Code: selected.code, Title: selected.title, Framework: selected.framework, Status: selected.status }).map(([k, v]) => (
              <Box key={k}><Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{v}</Typography></Box>
            ))}
          </Stack>
        ) : (dialogMode === 'create' || dialogMode === 'edit') ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Control Code" fullWidth value={form.code} onChange={(e) => updateForm('code', e.target.value)} placeholder="e.g. A.5.1" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Framework" fullWidth select value={form.framework} onChange={(e) => updateForm('framework', e.target.value)}>
              <MenuItem value="ISO 27001">ISO 27001</MenuItem><MenuItem value="SOC 2">SOC 2</MenuItem></TextField></Grid>
            <Grid size={12}><TextField label="Title" fullWidth value={form.title} onChange={(e) => updateForm('title', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Status" fullWidth select value={form.status} onChange={(e) => updateForm('status', e.target.value)}>
              {['Not Started', 'In Progress', 'Done'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
          </Grid>
        ) : null}
      </CrudDialog>
    </PageContainer>
  )
}

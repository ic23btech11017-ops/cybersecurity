import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Storage, Hub, Dns, Computer } from '@mui/icons-material'
import { PageContainer } from '../components/PageContainer'
import { ActionButtons } from '../components/ActionButtons'
import { KpiCard } from '../components/KpiCard'
import { CrudDialog } from '../components/CrudDialog'
import { useSnackbar } from '../components/SnackbarProvider'
import { cfmsService } from '../services/mock/cfmsService'
import type { Asset } from '../types/cfms'

const blankAsset: Omit<Asset, 'id'> = {
  clientId: 'CL-1',
  type: 'Server',
  ip: '',
  domain: '',
  os: '',
  owner: '',
  location: '',
  criticality: 'Medium',
}

export const AssetsPage = () => {
  const [rows, setRows] = useState<Asset[]>([])
  const [query, setQuery] = useState('')
  const { showSnackbar } = useSnackbar()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [selected, setSelected] = useState<Asset | null>(null)
  const [form, setForm] = useState(blankAsset)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cfmsService.getAssets().then(setRows)
  }, [])

  const filtered = useMemo(
    () => rows.filter((r) => r.domain.toLowerCase().includes(query.toLowerCase()) || r.ip.includes(query)),
    [query, rows],
  )

  const openCreate = () => { setDialogMode('create'); setForm(blankAsset); setSelected(null); setDialogOpen(true) }
  const openEdit = (a: Asset) => { setDialogMode('edit'); setForm({ ...a }); setSelected(a); setDialogOpen(true) }
  const openView = (a: Asset) => { setDialogMode('view'); setSelected(a); setDialogOpen(true) }
  const openDelete = (a: Asset) => { setDialogMode('delete'); setSelected(a); setDialogOpen(true) }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (dialogMode === 'create') {
      setRows((prev) => [{ ...form, id: `AST-${Date.now()}` }, ...prev])
      showSnackbar('Asset registered successfully')
    } else if (dialogMode === 'edit' && selected) {
      setRows((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...form } : r)))
      showSnackbar('Asset updated successfully')
    } else if (dialogMode === 'delete' && selected) {
      setRows((prev) => prev.filter((r) => r.id !== selected.id))
      showSnackbar('Asset deleted', 'error')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const columns: GridColDef<Asset>[] = [
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'domain', headerName: 'Domain', flex: 1,  },
    { field: 'ip', headerName: 'IP', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'os', headerName: 'OS', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'owner', headerName: 'Owner', width: 140 },
    {
      field: 'criticality',
      headerName: 'Criticality',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip size="small" label={params.value} color={params.value === 'Critical' ? 'error' : params.value === 'High' ? 'warning' : 'default'} />
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
    <PageContainer title="Assets" subtitle="Servers, endpoints, cloud and app assets mapped to business impact.">
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Total Assets" value={rows.length.toString()} delta="+5 this week" color="#3b82f6" icon={<Storage />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Critical Assets" value={rows.filter(r => r.criticality === 'Critical').length.toString()} delta="Patch required" color="#ef4444" icon={<Dns />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Endpoints" value={rows.filter(r => r.type === 'Endpoint').length.toString()} delta="Active" color="#14b8a6" icon={<Computer />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Cloud Regions" value={rows.filter(r => r.type === 'Cloud').length.toString()} delta="Multi-zone" color="#8b5cf6" icon={<Hub />} /></Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <TextField size="small" label="Search assets" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ maxWidth: 360 }} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Register Asset</Button>
        </Stack>
        <Paper sx={{ height: 520 }}>
          <DataGrid 
            rows={filtered} 
            columns={columns} 
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
        title={dialogMode === 'create' ? 'Register New Asset' : dialogMode === 'edit' ? 'Edit Asset' : dialogMode === 'view' ? 'Asset Details' : 'Delete Asset'}
        onSubmit={handleSubmit}
        loading={loading}
        deleteName={selected?.domain}
        maxWidth="md"
      >
        {dialogMode === 'view' && selected ? (
          <Stack spacing={2}>
            {Object.entries({ ID: selected.id, Type: selected.type, Domain: selected.domain, IP: selected.ip, OS: selected.os, Owner: selected.owner, Location: selected.location, Criticality: selected.criticality }).map(([k, v]) => (
              <Box key={k}><Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{v}</Typography></Box>
            ))}
          </Stack>
        ) : (dialogMode === 'create' || dialogMode === 'edit') ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Type" fullWidth select value={form.type} onChange={(e) => updateForm('type', e.target.value)}>{['Server', 'Endpoint', 'Cloud', 'App', 'Network'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Domain" fullWidth value={form.domain} onChange={(e) => updateForm('domain', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="IP Address" fullWidth value={form.ip} onChange={(e) => updateForm('ip', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Operating System" fullWidth value={form.os} onChange={(e) => updateForm('os', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Owner" fullWidth value={form.owner} onChange={(e) => updateForm('owner', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Location" fullWidth value={form.location} onChange={(e) => updateForm('location', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Criticality" fullWidth select value={form.criticality} onChange={(e) => updateForm('criticality', e.target.value)}>{['Critical', 'High', 'Medium', 'Low'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
          </Grid>
        ) : null}
      </CrudDialog>
    </PageContainer>
  )
}

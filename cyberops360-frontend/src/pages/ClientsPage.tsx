import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { AccountBalance, Shield, ErrorOutline, CheckCircleOutline } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/PageContainer'
import { ActionButtons } from '../components/ActionButtons'
import { KpiCard } from '../components/KpiCard'
import { CrudDialog } from '../components/CrudDialog'
import { useSnackbar } from '../components/SnackbarProvider'
import { cfmsService } from '../services/mock/cfmsService'
import type { Client } from '../types/cfms'

/* ── Default blank form ───────────────── */
const blankClient: Omit<Client, 'id'> = {
  name: '',
  industry: '',
  activeIncidents: 0,
  slaStatus: 'Healthy',
}

export const ClientsPage = () => {
  const navigate = useNavigate()
  const [rows, setRows] = useState<Client[]>([])
  const [query, setQuery] = useState('')
  const { showSnackbar } = useSnackbar()

  /* dialog state */
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [selected, setSelected] = useState<Client | null>(null)
  const [form, setForm] = useState(blankClient)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cfmsService.getClients().then(setRows)
  }, [])

  const filtered = useMemo(
    () => rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase())),
    [query, rows],
  )

  /* ── Handlers ──────────────────────── */
  const openCreate = () => {
    setDialogMode('create')
    setForm(blankClient)
    setSelected(null)
    setDialogOpen(true)
  }

  const openEdit = (client: Client) => {
    setDialogMode('edit')
    setForm({ name: client.name, industry: client.industry, activeIncidents: client.activeIncidents, slaStatus: client.slaStatus })
    setSelected(client)
    setDialogOpen(true)
  }

  const openDelete = (client: Client) => {
    setDialogMode('delete')
    setSelected(client)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (dialogMode === 'create') {
      const newClient: Client = { ...form, id: `CL-${Date.now()}` }
      setRows((prev) => [newClient, ...prev])
      showSnackbar('Client created successfully')
    } else if (dialogMode === 'edit' && selected) {
      setRows((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...form } : r)))
      showSnackbar('Client updated successfully')
    } else if (dialogMode === 'delete' && selected) {
      setRows((prev) => prev.filter((r) => r.id !== selected.id))
      showSnackbar('Client deleted successfully', 'error')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const updateForm = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  /* ── Columns ───────────────────────── */
  const columns: GridColDef<Client>[] = [
    { field: 'id', headerName: 'Client ID', width: 120 },
    { field: 'name', headerName: 'Client', flex: 1,  },
    { field: 'industry', headerName: 'Industry', flex: 1,  },
    { field: 'activeIncidents', headerName: 'Active Incidents', flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: 'slaStatus',
      headerName: 'SLA Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={params.value === 'Breach' ? 'error' : params.value === 'Watch' ? 'warning' : 'success'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtons
          onView={() => navigate('/clients/' + params.row.id)}
          onEdit={() => openEdit(params.row)}
          onDelete={() => openDelete(params.row)}
        />
      ),
    },
  ]

  /* ── Render ────────────────────────── */
  return (
    <PageContainer title="Clients" subtitle="Single source of truth for client operations and SLA posture.">
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Total Clients" value={rows.length.toString()} delta="+2 this month" color="#3b82f6" icon={<AccountBalance />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Active SLAs" value="98%" delta="On track" color="#14b8a6" icon={<Shield />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="SLA Breaches" value={rows.filter(r => r.slaStatus === 'Breach').length.toString()} delta="-1 vs last week" color="#ef4444" icon={<ErrorOutline />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Healthy Status" value={rows.filter(r => r.slaStatus === 'Healthy').length.toString()} delta="Stable" color="#8b5cf6" icon={<CheckCircleOutline />} /></Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <TextField
            size="small"
            label="Search clients"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{ maxWidth: 360 }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            Add Client
          </Button>
        </Stack>
        <Paper sx={{ height: 520 }}>
          <DataGrid 
            rows={filtered} 
            columns={columns} 
            pageSizeOptions={[5, 10]} 
            disableRowSelectionOnClick 
            onRowClick={(params) => navigate('/clients/' + params.row.id)}
            sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
          />
        </Paper>
      </Stack>

      {/* ── CRUD Dialog ──────────────── */}
      <CrudDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        title={
          dialogMode === 'create' ? 'Add New Client' :
          dialogMode === 'edit' ? 'Edit Client' :
          'Delete Client'
        }
        onSubmit={handleSubmit}
        loading={loading}
        deleteName={selected?.name}
      >
        {(dialogMode === 'create' || dialogMode === 'edit') ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Client Name" fullWidth value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Industry"
                fullWidth
                select
                value={form.industry}
                onChange={(e) => updateForm('industry', e.target.value)}
              >
                {['Finance', 'Healthcare', 'Energy', 'Technology', 'Manufacturing', 'Retail'].map((v) => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Active Incidents"
                fullWidth
                type="number"
                value={form.activeIncidents}
                onChange={(e) => updateForm('activeIncidents', Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="SLA Status"
                fullWidth
                select
                value={form.slaStatus}
                onChange={(e) => updateForm('slaStatus', e.target.value as Client['slaStatus'])}
              >
                {['Healthy', 'Watch', 'Breach'].map((v) => (
                  <MenuItem key={v} value={v}>{v}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        ) : null}
      </CrudDialog>
    </PageContainer>
  )
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
  </Box>
)

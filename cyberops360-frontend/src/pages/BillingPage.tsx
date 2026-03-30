import { useEffect, useState } from 'react'
import { Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { RequestQuote, Paid, HourglassEmpty, TrendingUp } from '@mui/icons-material'
import { PageContainer } from '../components/PageContainer'
import { ActionButtons } from '../components/ActionButtons'
import { KpiCard } from '../components/KpiCard'
import { CrudDialog } from '../components/CrudDialog'
import { useSnackbar } from '../components/SnackbarProvider'
import { cfmsService } from '../services/mock/cfmsService'
import type { Invoice } from '../types/cfms'

const blankInvoice: Omit<Invoice, 'id'> = {
  clientId: '',
  plan: 'Retainer',
  amountUsd: 0,
  status: 'Draft',
}

export const BillingPage = () => {
  const [rows, setRows] = useState<Invoice[]>([])
  const { showSnackbar } = useSnackbar()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [selected, setSelected] = useState<Invoice | null>(null)
  const [form, setForm] = useState(blankInvoice)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cfmsService.getInvoices().then(setRows)
  }, [])

  const openCreate = () => { setDialogMode('create'); setForm(blankInvoice); setSelected(null); setDialogOpen(true) }
  const openEdit = (i: Invoice) => { setDialogMode('edit'); setForm({ clientId: i.clientId, plan: i.plan, amountUsd: i.amountUsd, status: i.status }); setSelected(i); setDialogOpen(true) }
  const openView = (i: Invoice) => { setDialogMode('view'); setSelected(i); setDialogOpen(true) }
  const openDelete = (i: Invoice) => { setDialogMode('delete'); setSelected(i); setDialogOpen(true) }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (dialogMode === 'create') {
      setRows((prev) => [{ ...form, id: `INV-${Date.now()}` }, ...prev])
      showSnackbar('Invoice created successfully')
    } else if (dialogMode === 'edit' && selected) {
      setRows((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...form } : r)))
      showSnackbar('Invoice updated successfully')
    } else if (dialogMode === 'delete' && selected) {
      setRows((prev) => prev.filter((r) => r.id !== selected.id))
      showSnackbar('Invoice deleted', 'error')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const updateForm = (field: string, value: string | number) => setForm((prev) => ({ ...prev, [field]: value }))

  const columns: GridColDef<Invoice>[] = [
    { field: 'id', headerName: 'Invoice', width: 130 },
    { field: 'clientId', headerName: 'Client', flex: 1,  },
    { field: 'plan', headerName: 'Plan', width: 130 },
    {
      field: 'amountUsd',
      headerName: 'Amount',
      flex: 1,
      align: 'right',
      headerAlign: 'right',
      valueGetter: (_value, row) => `$${row.amountUsd.toLocaleString()}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color={params.value === 'Paid' ? 'success' : params.value === 'Sent' ? 'warning' : 'default'} />
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
    <PageContainer title="Billing" subtitle="Retainer and usage invoice visibility for finance operations.">
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Monthly Recurring" value={`$${rows.filter(r => r.plan === 'Retainer').reduce((sum, r) => sum + r.amountUsd, 0).toLocaleString()}`} delta="Retainer" color="#3b82f6" icon={<TrendingUp />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Usage Billed" value={`$${rows.filter(r => r.plan === 'Usage').reduce((sum, r) => sum + r.amountUsd, 0).toLocaleString()}`} delta="This month" color="#14b8a6" icon={<RequestQuote />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Pending Payment" value={`$${rows.filter(r => r.status === 'Sent' || r.status === 'Draft').reduce((sum, r) => sum + r.amountUsd, 0).toLocaleString()}`} delta="Awaiting" color="#f59e0b" icon={<HourglassEmpty />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Collected" value={`$${rows.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.amountUsd, 0).toLocaleString()}`} delta="Last 30 days" color="#8b5cf6" icon={<Paid />} /></Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Create Invoice</Button>
        </Stack>
        <Paper sx={{ height: 520 }}>
          <DataGrid 
            rows={rows} 
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
        title={dialogMode === 'create' ? 'Create New Invoice' : dialogMode === 'edit' ? 'Edit Invoice' : dialogMode === 'view' ? 'Invoice Details' : 'Delete Invoice'}
        onSubmit={handleSubmit}
        loading={loading}
        deleteName={selected?.id}
      >
        {dialogMode === 'view' && selected ? (
          <Stack spacing={2}>
            {Object.entries({ ID: selected.id, Client: selected.clientId, Plan: selected.plan, Amount: `$${selected.amountUsd.toLocaleString()}`, Status: selected.status }).map(([k, v]) => (
              <Box key={k}><Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{v}</Typography></Box>
            ))}
          </Stack>
        ) : (dialogMode === 'create' || dialogMode === 'edit') ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Client ID" fullWidth value={form.clientId} onChange={(e) => updateForm('clientId', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Plan" fullWidth select value={form.plan} onChange={(e) => updateForm('plan', e.target.value)}>
              <MenuItem value="Retainer">Retainer</MenuItem><MenuItem value="Usage">Usage</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Amount (USD)" fullWidth type="number" value={form.amountUsd} onChange={(e) => updateForm('amountUsd', Number(e.target.value))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Status" fullWidth select value={form.status} onChange={(e) => updateForm('status', e.target.value)}>
              {['Draft', 'Sent', 'Paid'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
          </Grid>
        ) : null}
      </CrudDialog>
    </PageContainer>
  )
}

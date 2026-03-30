import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Warning, Thermostat, Moving, AssignmentTurnedIn } from '@mui/icons-material'
import { PageContainer } from '../components/PageContainer'
import { ActionButtons } from '../components/ActionButtons'
import { KpiCard } from '../components/KpiCard'
import { CrudDialog } from '../components/CrudDialog'
import { useSnackbar } from '../components/SnackbarProvider'
import { cfmsService } from '../services/mock/cfmsService'
import type { Risk } from '../types/cfms'

type RiskWithScore = Risk & { score: number }

const blankRisk: Omit<Risk, 'id'> = {
  title: '',
  assetId: '',
  likelihood: 3,
  impact: 3,
  treatment: 'Mitigate',
  owner: '',
}

export const RisksPage = () => {
  const [rows, setRows] = useState<RiskWithScore[]>([])
  const [ownerFilter, setOwnerFilter] = useState<'All' | string>('All')
  const [minScore, setMinScore] = useState(1)
  const { showSnackbar } = useSnackbar()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [selected, setSelected] = useState<RiskWithScore | null>(null)
  const [form, setForm] = useState(blankRisk)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    cfmsService.getRisks().then(setRows)
  }, [])

  const ownerOptions = useMemo(() => ['All', ...new Set(rows.map((r) => r.owner))], [rows])
  const filteredRows = useMemo(
    () => rows.filter((r) => (ownerFilter === 'All' || r.owner === ownerFilter) && r.score >= minScore),
    [rows, ownerFilter, minScore],
  )

  const openCreate = () => { setDialogMode('create'); setForm(blankRisk); setSelected(null); setDialogOpen(true) }
  const openEdit = (r: RiskWithScore) => { setDialogMode('edit'); setForm({ title: r.title, assetId: r.assetId, likelihood: r.likelihood, impact: r.impact, treatment: r.treatment, owner: r.owner }); setSelected(r); setDialogOpen(true) }
  const openView = (r: RiskWithScore) => { setDialogMode('view'); setSelected(r); setDialogOpen(true) }
  const openDelete = (r: RiskWithScore) => { setDialogMode('delete'); setSelected(r); setDialogOpen(true) }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    if (dialogMode === 'create') {
      const newRisk: RiskWithScore = { ...form, id: `RSK-${Date.now()}`, score: form.likelihood * form.impact }
      setRows((prev) => [newRisk, ...prev])
      showSnackbar('Risk logged successfully')
    } else if (dialogMode === 'edit' && selected) {
      setRows((prev) => prev.map((r) => (r.id === selected.id ? { ...r, ...form, score: form.likelihood * form.impact } : r)))
      showSnackbar('Risk updated successfully')
    } else if (dialogMode === 'delete' && selected) {
      setRows((prev) => prev.filter((r) => r.id !== selected.id))
      showSnackbar('Risk deleted', 'error')
    }
    setLoading(false)
    setDialogOpen(false)
  }

  const updateForm = (field: string, value: string | number) => setForm((prev) => ({ ...prev, [field]: value }))

  const columns: GridColDef<RiskWithScore>[] = [
    { field: 'id', headerName: 'Risk ID', width: 110 },
    { field: 'title', headerName: 'Risk', flex: 1,  },
    { field: 'likelihood', headerName: 'Likelihood', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'impact', headerName: 'Impact', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'score', headerName: 'Score', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'treatment', headerName: 'Treatment', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'owner', headerName: 'Owner', width: 130 },
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
    <PageContainer title="Risk Register" subtitle="Likelihood-impact scoring with treatment tracking.">
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Total Risks" value={rows.length.toString()} delta="Active" color="#3b82f6" icon={<Warning />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="High Impact" value={rows.filter(r => r.impact >= 4).length.toString()} delta="Needs action" color="#ef4444" icon={<Thermostat />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Likely to Occur" value={rows.filter(r => r.likelihood >= 4).length.toString()} delta="Immediate" color="#f59e0b" icon={<Moving />} /></Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}><KpiCard label="Mitigated" value={rows.filter(r => r.treatment === 'Mitigate').length.toString()} delta="Under treatment" color="#14b8a6" icon={<AssignmentTurnedIn />} /></Grid>
        </Grid>

        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField size="small" select label="Risk owner" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} sx={{  }}>
              {ownerOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
            </TextField>
            <TextField size="small" select label="Min score" value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} sx={{  }}>
              {[1, 5, 10, 15, 20].map((s) => <MenuItem key={s} value={s}>{s}+</MenuItem>)}
            </TextField>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Log Risk</Button>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ height: 520 }}>
              <DataGrid 
                rows={filteredRows} 
                columns={columns} 
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }} 
                pageSizeOptions={[5, 10]} 
                disableRowSelectionOnClick 
                onRowClick={(params) => openView(params.row)}
                sx={{ '& .MuiDataGrid-row': { cursor: 'pointer' } }}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Heatmap View</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis dataKey="likelihood" type="number" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                    <YAxis dataKey="impact" type="number" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter data={filteredRows} fill="#ef4444" />
                  </ScatterChart>
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
        title={dialogMode === 'create' ? 'Log New Risk' : dialogMode === 'edit' ? 'Edit Risk' : dialogMode === 'view' ? 'Risk Details' : 'Delete Risk'}
        onSubmit={handleSubmit}
        loading={loading}
        deleteName={selected?.title}
      >
        {dialogMode === 'view' && selected ? (
          <Stack spacing={2}>
            {Object.entries({ 'Risk ID': selected.id, Title: selected.title, Likelihood: String(selected.likelihood), Impact: String(selected.impact), Score: String(selected.score), Treatment: selected.treatment, Owner: selected.owner }).map(([k, v]) => (
              <Box key={k}><Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem' }}>{k}</Typography><Typography variant="body1" sx={{ fontWeight: 500 }}>{v}</Typography></Box>
            ))}
          </Stack>
        ) : (dialogMode === 'create' || dialogMode === 'edit') ? (
          <Grid container spacing={2}>
            <Grid size={12}><TextField label="Risk Title" fullWidth value={form.title} onChange={(e) => updateForm('title', e.target.value)} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Likelihood (1-5)" fullWidth type="number" slotProps={{ htmlInput: { min: 1, max: 5 } }} value={form.likelihood} onChange={(e) => updateForm('likelihood', Number(e.target.value))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Impact (1-5)" fullWidth type="number" slotProps={{ htmlInput: { min: 1, max: 5 } }} value={form.impact} onChange={(e) => updateForm('impact', Number(e.target.value))} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Treatment" fullWidth select value={form.treatment} onChange={(e) => updateForm('treatment', e.target.value)}>{['Mitigate', 'Transfer', 'Accept', 'Avoid'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField label="Owner" fullWidth value={form.owner} onChange={(e) => updateForm('owner', e.target.value)} /></Grid>
          </Grid>
        ) : null}
      </CrudDialog>
    </PageContainer>
  )
}

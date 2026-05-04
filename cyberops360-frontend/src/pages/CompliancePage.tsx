import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Chip, Drawer, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { PageContainer } from '../components/PageContainer'
import { cfmsService } from '../services/mock/cfmsService'
import type { Control } from '../types/cfms'

const columns: GridColDef<Control>[] = [
  { field: 'code', headerName: 'Control', width: 110 },
  { field: 'title', headerName: 'Title', flex: 1, minWidth: 220 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => (
      <Chip
        size="small"
        label={params.value}
        color={params.value === 'Done' ? 'success' : params.value === 'In Progress' ? 'warning' : 'default'}
      />
    ),
  },
]

export const CompliancePage = () => {
  const [controls, setControls] = useState<Control[]>([])
  const [framework, setFramework] = useState<'ISO 27001' | 'SOC 2'>('ISO 27001')
  const [statusFilter, setStatusFilter] = useState<'All' | Control['status']>('All')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Control | null>(null)
  const [nextStatus, setNextStatus] = useState<Control['status']>('Not Started')

  useEffect(() => {
    cfmsService.getControls().then(setControls)
  }, [])

  const filtered = useMemo(
    () =>
      controls.filter(
        (control) =>
          control.framework === framework &&
          (statusFilter === 'All' || control.status === statusFilter) &&
          (control.title.toLowerCase().includes(query.toLowerCase()) ||
            control.code.toLowerCase().includes(query.toLowerCase())),
      ),
    [controls, framework, query, statusFilter],
  )

  const applyControlUpdate = () => {
    if (!selected) {
      return
    }

    setControls((prev) => prev.map((control) => (control.id === selected.id ? { ...control, status: nextStatus } : control)))
    setSelected((prev) => (prev ? { ...prev, status: nextStatus } : prev))
  }

  return (
    <PageContainer title="Compliance" subtitle="Framework controls, completion tracking, and audit readiness.">
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            select
            label="Framework"
            value={framework}
            onChange={(event) => setFramework(event.target.value as 'ISO 27001' | 'SOC 2')}
            sx={{ maxWidth: 220 }}
          >
            <MenuItem value="ISO 27001">ISO 27001</MenuItem>
            <MenuItem value="SOC 2">SOC 2</MenuItem>
          </TextField>
          <TextField
            size="small"
            select
            label="Status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'All' | Control['status'])}
            sx={{ maxWidth: 220 }}
          >
            {['All', 'Not Started', 'In Progress', 'Done'].map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Search controls"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{ minWidth: 220 }}
          />
        </Stack>
        <Paper sx={{ height: 520 }}>
          <DataGrid
            rows={filtered}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
            onRowClick={(params) => {
              setSelected(params.row)
              setNextStatus(params.row.status)
            }}
          />
        </Paper>
      </Stack>

      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)}>
        <Box sx={{ width: 360, p: 3 }}>
          {selected && (
            <Stack spacing={2}>
              <Typography variant="h6">{selected.code}</Typography>
              <Typography variant="body1">{selected.title}</Typography>
              <Typography variant="body2">Framework: {selected.framework}</Typography>
              <TextField
                size="small"
                select
                label="Update status"
                value={nextStatus}
                onChange={(event) => setNextStatus(event.target.value as Control['status'])}
              >
                {['Not Started', 'In Progress', 'Done'].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="contained" onClick={applyControlUpdate}>
                Save control update
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </PageContainer>
  )
}

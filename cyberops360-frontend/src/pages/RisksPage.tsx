import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Drawer, Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import { PageContainer } from '../components/PageContainer'
import { cfmsService } from '../services/mock/cfmsService'
import type { Risk } from '../types/cfms'

type RiskWithScore = Risk & { score: number }

const columns: GridColDef<RiskWithScore>[] = [
  { field: 'title', headerName: 'Risk', flex: 1.3, minWidth: 220 },
  { field: 'likelihood', headerName: 'Likelihood', width: 120 },
  { field: 'impact', headerName: 'Impact', width: 100 },
  { field: 'score', headerName: 'Score', width: 90 },
  { field: 'treatment', headerName: 'Treatment', width: 130 },
  { field: 'owner', headerName: 'Owner', width: 130 },
]

export const RisksPage = () => {
  const [rows, setRows] = useState<RiskWithScore[]>([])
  const [selected, setSelected] = useState<RiskWithScore | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<'All' | string>('All')
  const [minScore, setMinScore] = useState(1)
  const [nextTreatment, setNextTreatment] = useState<Risk['treatment']>('Mitigate')

  useEffect(() => {
    cfmsService.getRisks().then(setRows)
  }, [])

  const ownerOptions = useMemo(() => ['All', ...new Set(rows.map((row) => row.owner))], [rows])
  const filteredRows = useMemo(
    () => rows.filter((row) => (ownerFilter === 'All' || row.owner === ownerFilter) && row.score >= minScore),
    [rows, ownerFilter, minScore],
  )

  const applyRiskUpdate = () => {
    if (!selected) {
      return
    }

    setRows((prev) =>
      prev.map((risk) =>
        risk.id === selected.id
          ? {
              ...risk,
              treatment: nextTreatment,
              score: risk.likelihood * risk.impact,
            }
          : risk,
      ),
    )
    setSelected((prev) => (prev ? { ...prev, treatment: nextTreatment } : prev))
  }

  return (
    <PageContainer title="Risk Register" subtitle="Likelihood-impact scoring with treatment tracking.">
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            size="small"
            select
            label="Risk owner"
            value={ownerFilter}
            onChange={(event) => setOwnerFilter(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            {ownerOptions.map((owner) => (
              <MenuItem key={owner} value={owner}>
                {owner}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            select
            label="Min score"
            value={minScore}
            onChange={(event) => setMinScore(Number(event.target.value))}
            sx={{ minWidth: 140 }}
          >
            {[1, 5, 10, 15, 20].map((score) => (
              <MenuItem key={score} value={score}>
                {score}+
              </MenuItem>
            ))}
          </TextField>
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
              onRowClick={(params) => {
                setSelected(params.row)
                setNextTreatment(params.row.treatment)
              }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Heatmap View
              </Typography>
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

      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)}>
        <Box sx={{ width: 360, p: 3 }}>
          {selected && (
            <Stack spacing={2}>
              <Typography variant="h6">{selected.id}</Typography>
              <Typography variant="body1">{selected.title}</Typography>
              <Typography variant="body2">Likelihood: {selected.likelihood}</Typography>
              <Typography variant="body2">Impact: {selected.impact}</Typography>
              <Typography variant="body2">Current score: {selected.score}</Typography>
              <TextField
                size="small"
                select
                label="Treatment"
                value={nextTreatment}
                onChange={(event) => setNextTreatment(event.target.value as Risk['treatment'])}
              >
                {['Mitigate', 'Transfer', 'Accept', 'Avoid'].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="contained" onClick={applyRiskUpdate}>
                Save treatment update
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </PageContainer>
  )
}

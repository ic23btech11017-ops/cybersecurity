import { describe, expect, it } from 'vitest'
import { cfmsService } from '../services/mock/cfmsService'

describe('cfmsService', () => {
  it('returns dashboard KPIs', async () => {
    const kpis = await cfmsService.getKpis()

    expect(kpis.length).toBeGreaterThan(0)
    expect(kpis[0]).toHaveProperty('label')
    expect(kpis[0]).toHaveProperty('value')
  })

  it('returns incidents and risks with computed score', async () => {
    const incidents = await cfmsService.getIncidents()
    const risks = await cfmsService.getRisks()

    expect(incidents.length).toBeGreaterThan(0)
    expect(risks[0].score).toBe(risks[0].likelihood * risks[0].impact)
  })
})

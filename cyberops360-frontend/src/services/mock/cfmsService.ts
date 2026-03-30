import assetsJson from './data/assets.json'
import clientsJson from './data/clients.json'
import controlsJson from './data/controls.json'
import incidentsJson from './data/incidents.json'
import invoicesJson from './data/invoices.json'
import risksJson from './data/risks.json'
import type { Asset, Client, Control, Incident, Invoice, Kpi, Risk } from '../../types/cfms'

const pause = (ms = 160) => new Promise((resolve) => setTimeout(resolve, ms))

const clients = clientsJson as Client[]
const assets = assetsJson as Asset[]
const incidents = incidentsJson as Incident[]
const risks = risksJson as Risk[]
const controls = controlsJson as Control[]
const invoices = invoicesJson as Invoice[]

export const cfmsService = {
  async getKpis(): Promise<Kpi[]> {
    await pause()
    const mttrHours = 3.8
    const slaHealthy = Math.round(
      (incidents.filter((incident) => incident.slaMinutesRemaining > 30).length /
        incidents.length) *
        100,
    )

    return [
      { label: 'Open Incidents', value: `${incidents.length}`, delta: '+12% vs yesterday' },
      { label: 'MTTR', value: `${mttrHours}h`, delta: '-18% this month' },
      { label: 'SLA Compliance', value: `${slaHealthy}%`, delta: '+4 pts this week' },
      { label: 'Risk Register', value: `${risks.length}`, delta: 'Top 2 need mitigation' },
    ]
  },

  async getClients(): Promise<Client[]> {
    await pause()
    return clients
  },

  async getAssets(): Promise<Asset[]> {
    await pause()
    return assets
  },

  async getIncidents(): Promise<Incident[]> {
    await pause()
    return incidents
  },

  async getRisks(): Promise<(Risk & { score: number })[]> {
    await pause()
    return risks.map((risk) => ({ ...risk, score: risk.likelihood * risk.impact }))
  },

  async getControls(): Promise<Control[]> {
    await pause()
    return controls
  },

  async getInvoices(): Promise<Invoice[]> {
    await pause()
    return invoices
  },
}

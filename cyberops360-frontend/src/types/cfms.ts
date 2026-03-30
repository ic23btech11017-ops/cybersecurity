export type Role =
  | 'super_admin'
  | 'analyst_l1'
  | 'analyst_l2'
  | 'analyst_l3'
  | 'compliance_manager'
  | 'finance_admin'
  | 'client_admin'
  | 'auditor'
  | 'stakeholder'

export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'

export interface Kpi {
  label: string
  value: string
  delta: string
}

export interface Client {
  id: string
  name: string
  industry: string
  activeIncidents: number
  slaStatus: 'Healthy' | 'Watch' | 'Breach'
}

export interface Asset {
  id: string
  clientId: string
  type: 'Server' | 'Endpoint' | 'Cloud' | 'App' | 'Network'
  ip: string
  domain: string
  os: string
  owner: string
  location: string
  criticality: 'Critical' | 'High' | 'Medium' | 'Low'
}

export interface Incident {
  id: string
  title: string
  severity: Severity
  status:
    | 'New'
    | 'Triage'
    | 'In Progress'
    | 'Escalated'
    | 'Resolved'
    | 'Closed'
  assignedAnalyst: string
  clientId: string
  assetId: string
  slaMinutesRemaining: number
  createdAt: string
}

export interface Risk {
  id: string
  title: string
  assetId: string
  likelihood: number
  impact: number
  treatment: 'Mitigate' | 'Transfer' | 'Accept' | 'Avoid'
  owner: string
}

export interface Control {
  id: string
  framework: 'ISO 27001' | 'SOC 2'
  code: string
  title: string
  status: 'Not Started' | 'In Progress' | 'Done'
}

export interface Invoice {
  id: string
  clientId: string
  plan: 'Retainer' | 'Usage'
  amountUsd: number
  status: 'Draft' | 'Sent' | 'Paid'
}

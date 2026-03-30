import { ThemeProvider } from '@mui/material'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CompliancePage } from '../pages/CompliancePage'
import { IncidentsPage } from '../pages/IncidentsPage'
import { RisksPage } from '../pages/RisksPage'
import { getCfmsTheme } from '../theme/cfmsTheme'

const renderWithProviders = (ui: ReactElement) =>
  render(
    <ThemeProvider theme={getCfmsTheme('dark')}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>,
  )

describe('workflow editing integration', () => {
  it('updates incident status from the drawer workflow', async () => {
    renderWithProviders(<IncidentsPage />)

    const rowCell = await screen.findByText('Suspicious OAuth token replay')
    fireEvent.click(rowCell)

    await screen.findByLabelText('Update status')

    const statusInput = screen.getByLabelText('Update status')
    fireEvent.mouseDown(statusInput)

    const listbox = await screen.findByRole('listbox')
    fireEvent.click(within(listbox).getByText('Resolved'))

    fireEvent.click(screen.getByRole('button', { name: 'Save workflow update' }))

    await waitFor(() => {
      expect(screen.getAllByText('Resolved').length).toBeGreaterThan(0)
    })
  })

  it('updates risk treatment from the drawer workflow', async () => {
    renderWithProviders(<RisksPage />)

    const rowCell = await screen.findByText('Weak API auth flow')
    fireEvent.click(rowCell)

    await screen.findByText('rsk-317')

    const treatmentInput = screen.getByLabelText('Treatment')
    fireEvent.mouseDown(treatmentInput)

    const listbox = await screen.findByRole('listbox')
    fireEvent.click(within(listbox).getByText('Accept'))

    fireEvent.click(screen.getByRole('button', { name: 'Save treatment update' }))

    await waitFor(() => {
      expect(screen.getAllByText('Accept').length).toBeGreaterThan(0)
    })
  })

  it('updates compliance control status from the drawer workflow', async () => {
    renderWithProviders(<CompliancePage />)

    const rowCell = await screen.findByText('Configuration management')
    fireEvent.click(rowCell)

    await screen.findByLabelText('Update status')

    const statusInput = screen.getByLabelText('Update status')
    fireEvent.mouseDown(statusInput)

    const listbox = await screen.findByRole('listbox')
    fireEvent.click(within(listbox).getByText('Done'))

    fireEvent.click(screen.getByRole('button', { name: 'Save control update' }))

    await waitFor(() => {
      expect(screen.getAllByText('Done').length).toBeGreaterThan(0)
    })
  })
})

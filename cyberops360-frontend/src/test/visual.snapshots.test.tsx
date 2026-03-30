import { ThemeProvider } from '@mui/material'
import { render, screen } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { DashboardPage } from '../pages/DashboardPage'
import { SocQueuePage } from '../pages/SupportPages'
import { getCfmsTheme } from '../theme/cfmsTheme'

const renderWithProviders = (ui: ReactElement) =>
  render(
    <ThemeProvider theme={getCfmsTheme('dark')}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>,
  )

describe('visual snapshots', () => {
  it('matches dashboard page snapshot', async () => {
    const { container } = renderWithProviders(<DashboardPage />)
    await screen.findByText('Open Incidents')
    ;(container.firstChild as HTMLElement | null)?.removeAttribute('style')
    expect(container.firstChild).toMatchSnapshot()
  })

  it('matches soc queue page snapshot', () => {
    const { container } = renderWithProviders(<SocQueuePage />)
    ;(container.firstChild as HTMLElement | null)?.removeAttribute('style')
    expect(container.firstChild).toMatchSnapshot()
  })
})

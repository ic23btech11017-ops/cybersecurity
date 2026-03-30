import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../auth/AuthContext'
import { LoginPage } from '../pages/LoginPage'

describe('login placeholder flow', () => {
  it('shows login action and allows continue', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/2fa" element={<div>2FA Route Ready</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    expect(screen.getByText('CyberOps360')).toBeInTheDocument()
    const button = screen.getByRole('button', { name: 'Continue to 2FA' })
    fireEvent.click(button)
    expect(screen.getByText('2FA Route Ready')).toBeInTheDocument()
  })
})

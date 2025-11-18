import React from 'react'
import { render, screen } from '@testing-library/react'
import { Header } from '../Header'
import { AuthProvider } from '@/lib/auth-context'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>)
}

describe('Header', () => {
  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'true')
    Storage.prototype.setItem = jest.fn()
  })

  it('renders the QuarkLeads logo', () => {
    renderWithAuth(<Header />)
    expect(screen.getByText('QuarkLeads')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderWithAuth(<Header />)
    expect(
      screen.getByText("World's Most Advanced Lead Management System")
    ).toBeInTheDocument()
  })

  it('has toggle sidebar button', () => {
    renderWithAuth(<Header />)
    const toggleButton = screen.getByLabelText('Toggle sidebar')
    expect(toggleButton).toBeInTheDocument()
  })
})


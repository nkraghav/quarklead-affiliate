import React from 'react'
import { render, screen } from '@testing-library/react'
import { Sidebar } from '../Sidebar'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/profile',
}))

describe('Sidebar', () => {
  it('renders menu items', () => {
    render(<Sidebar />)
    expect(screen.getByText('My Profile')).toBeInTheDocument()
    expect(screen.getByText('Affiliate URL')).toBeInTheDocument()
    expect(screen.getByText('Account Details')).toBeInTheDocument()
    expect(screen.getByText('My Earning')).toBeInTheDocument()
    expect(screen.getByText('Offers')).toBeInTheDocument()
  })

  it('highlights active menu item', () => {
    render(<Sidebar />)
    const activeLink = screen.getByText('My Profile').closest('a')
    expect(activeLink).toHaveAttribute('aria-current', 'page')
  })
})


'use client'

import React from 'react'
import { ChevronLeft, Maximize2, User, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

interface HeaderProps {
  onSidebarToggle?: () => void
  sidebarCollapsed?: boolean
}

export function Header({ onSidebarToggle, sidebarCollapsed = false }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSidebarToggle}
            className="p-1.5 rounded-md hover:bg-gray-100 focus-visible-ring transition-colors"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={clsx(
                'w-5 h-5 text-gray-600 transition-transform duration-300',
                sidebarCollapsed && 'rotate-180'
              )}
            />
          </button>
          
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg md:text-xl">Q</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-bold text-gray-900 leading-tight">QuarkLeads</h1>
              <p className="text-xs text-gray-500 leading-tight hidden sm:block">
                World&apos;s Most Advanced Lead Management System
              </p>
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            className="p-2 rounded-md hover:bg-gray-100 focus-visible-ring transition-colors"
            aria-label="Full screen"
          >
            <Maximize2 className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-sm text-gray-700 hidden sm:inline">Howdy, {user?.name?.split(' ')[0] || 'User'}</span>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-gray-100 focus-visible-ring transition-colors ml-2"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}


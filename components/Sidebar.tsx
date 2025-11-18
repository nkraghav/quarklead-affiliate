'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Link2, CreditCard, TrendingUp, Gift } from 'lucide-react'
import clsx from 'clsx'

interface SidebarProps {
  collapsed?: boolean
}

const menuItems = [
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/affiliate-url', label: 'Affiliate URL', icon: Link2 },
  { href: '/account-details', label: 'Bank details', icon: CreditCard },
  { href: '/earnings', label: 'My Earning', icon: TrendingUp },
  { href: '/offers', label: 'Offers', icon: Gift },
]

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={clsx(
        'bg-sidebar h-full transition-all duration-300 border-r border-gray-200',
        collapsed ? 'w-16' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      <div className="p-4 md:p-6">
        <h2 className={clsx('font-semibold text-gray-800 mb-4 md:mb-6 text-base md:text-lg', collapsed && 'sr-only')}>
          Menu
        </h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus-visible-ring',
                      isActive
                        ? 'bg-sidebar-active text-white font-medium shadow-sm'
                        : 'text-gray-700 hover:bg-white/50',
                      collapsed && 'justify-center px-2'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm md:text-base">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}


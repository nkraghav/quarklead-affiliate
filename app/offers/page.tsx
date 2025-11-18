'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Gift, Tag, Percent } from 'lucide-react'

export default function OffersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Header
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar collapsed={sidebarCollapsed} />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Gift className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900">Offers</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <Tag className="w-8 h-8 text-secondary" />
                      <span className="bg-secondary text-white text-xs font-medium px-2 py-1 rounded">
                        Active
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Special Offer {item}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Limited time offer with exclusive benefits for affiliates.
                    </p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <Percent className="w-4 h-4" />
                      <span>Up to 25% commission</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}


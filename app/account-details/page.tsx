'use client'

import React, { useState } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { CreditCard, Banknote, Wallet } from 'lucide-react'

export default function AccountDetailsPage() {
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
                <CreditCard className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900">Account Details</h1>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Methods</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <CreditCard className="w-8 h-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Credit Card</h3>
                      <p className="text-sm text-gray-500">Manage card details</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <Banknote className="w-8 h-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Bank Account</h3>
                      <p className="text-sm text-gray-500">Link bank account</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                      <Wallet className="w-8 h-8 text-gray-400 mb-2" />
                      <h3 className="font-medium text-gray-900">Wallet</h3>
                      <p className="text-sm text-gray-500">Digital wallet options</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">No billing information available.</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}


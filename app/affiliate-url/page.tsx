'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Copy, Check, Link2 } from 'lucide-react'

export default function AffiliateUrlPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)
  const affiliateUrl = 'https://quarkleads.com/ref/ravi123'

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
                <Link2 className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900">Affiliate URL</h1>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Affiliate Link
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={affiliateUrl}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={handleCopy}
                      className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors focus-visible-ring flex items-center gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Share this link with others to earn commissions on referrals.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}


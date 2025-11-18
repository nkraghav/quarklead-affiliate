'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AddUrlModal } from '@/components/AddUrlModal'
import { AffiliateUrlTable } from '@/components/AffiliateUrlTable'
import { ToastContainer, ToastType } from '@/components/Toast'
import { Plus } from 'lucide-react'

interface AffiliateLink {
  id: string
  url: string
  platform: string
  destinationUrl: string
  expiryUnix: number
  commissionPercent: number
  isActive: boolean
  createdAt: number
  tags?: string
  conversions: number
  customPlatformName?: string
}

interface Toast {
  id: string
  message: string
  type: ToastType
}

export default function AffiliateUrlPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [editLink, setEditLink] = useState<AffiliateLink | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchLinks()
  }, [filter, platformFilter, searchQuery])

  const fetchLinks = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('status', filter)
      }
      if (platformFilter !== 'all') {
        params.append('platform', platformFilter)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/affiliate?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch affiliate links')
      const data = await response.json()
      setLinks(data)
    } catch (error) {
      showToast('Failed to load affiliate links', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleAdd = () => {
    setEditLink(null)
    setIsModalOpen(true)
  }

  const handleEdit = (link: AffiliateLink) => {
    setEditLink(link)
    setIsModalOpen(true)
  }

  const handleDelete = async (link: AffiliateLink) => {
    if (!confirm(`Are you sure you want to delete the ${link.platform} affiliate link?`)) {
      return
    }

    try {
      const response = await fetch(`/api/affiliate/${link.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete affiliate link')

      showToast('Affiliate link deleted successfully', 'success')
      fetchLinks()
    } catch (error) {
      showToast('Failed to delete affiliate link', 'error')
    }
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    showToast('URL copied to clipboard', 'success')
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditLink(null)
  }

  const handleModalSuccess = () => {
    showToast(editLink ? 'Affiliate link updated successfully' : 'Affiliate link created successfully', 'success')
    fetchLinks()
  }

  const uniquePlatforms = Array.from(new Set(links.map((l) => l.platform)))

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
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Affiliate URL&apos;s</h1>
                <button
                  onClick={handleAdd}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors focus-visible-ring flex items-center gap-2 shadow-sm"
                  aria-label="Add URL"
                >
                  <Plus className="w-5 h-5" />
                  Add Url
                </button>
              </div>

              {/* Filters */}
              <div className="mb-6 space-y-4">
                {/* Status Filter Tabs */}
                <div className="flex items-center gap-2 border-b border-gray-200">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    All URL&apos;s
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      filter === 'active'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilter('inactive')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      filter === 'inactive'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Inactive
                  </button>
                </div>

                {/* Search and Platform Filter */}
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search URLs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Platforms</option>
                    {uniquePlatforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading affiliate links...</p>
                  </div>
                </div>
              ) : (
                <AffiliateUrlTable
                  links={links}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onCopy={handleCopy}
                />
              )}
            </div>
          </main>
        </div>

        {/* Modals */}
        <AddUrlModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          editLink={editLink}
        />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ProtectedRoute>
  )
}

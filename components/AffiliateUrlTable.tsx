'use client'

import React, { useState } from 'react'
import { Copy, Edit2, Trash2, Check, Square, CheckSquare2 } from 'lucide-react'
import { truncateUrl, calculateTimeLeft, Platform } from '@/lib/affiliate-utils'
import clsx from 'clsx'

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

interface AffiliateUrlTableProps {
  links: AffiliateLink[]
  onEdit: (link: AffiliateLink) => void
  onDelete: (link: AffiliateLink) => void
  onCopy: (url: string) => void
}

export function AffiliateUrlTable({ links, onEdit, onDelete, onCopy }: AffiliateUrlTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (url: string, id: string) => {
    onCopy(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === links.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(links.map((l) => l.id)))
    }
  }

  const getPlatformIcon = (platform: string) => {
    // In a real app, you'd use actual platform icons
    return '🔗'
  }

  const getStatusBadge = (link: AffiliateLink) => {
    const timeLeft = calculateTimeLeft(link.expiryUnix)
    const isExpired = timeLeft.expired || !link.isActive

    return (
      <span
        className={clsx(
          'px-2 py-1 rounded text-xs font-medium',
          isExpired
            ? 'bg-red-100 text-red-800'
            : 'bg-green-100 text-green-800'
        )}
      >
        {isExpired ? 'Inactive' : 'Active'}
      </span>
    )
  }

  const formatTimeLeft = (expiryUnix: number) => {
    const timeLeft = calculateTimeLeft(expiryUnix)
    if (timeLeft.expired) return '0 Days'
    return `${timeLeft.value} ${timeLeft.unit}`
  }

  const formatDiscount = (percent: number) => {
    return `${String(Math.round(percent)).padStart(2, '0')} %`
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No affiliate URLs found. Click &quot;Add Url&quot; to create your first one.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left">
              <button
                onClick={toggleSelectAll}
                className="focus-visible-ring p-1 rounded"
                aria-label="Select all"
              >
                {selectedIds.size === links.length ? (
                  <CheckSquare2 className="w-5 h-5 text-primary" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Platform
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URL
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time Left
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversions
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {links.map((link) => {
            const isSelected = selectedIds.has(link.id)
            const isCopied = copiedId === link.id
            const timeLeft = formatTimeLeft(link.expiryUnix)

            return (
              <tr
                key={link.id}
                className={clsx('hover:bg-gray-50 transition-colors', isSelected && 'bg-blue-50')}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleSelect(link.id)}
                    className="focus-visible-ring p-1 rounded"
                    aria-label={`Select ${link.platform} link`}
                  >
                    {isSelected ? (
                      <CheckSquare2 className="w-5 h-5 text-primary" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPlatformIcon(link.platform)}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {link.customPlatformName || link.platform}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 truncate max-w-xs" title={link.url}>
                      {truncateUrl(link.url, 25)}
                    </span>
                    <button
                      onClick={() => handleCopy(link.url, link.id)}
                      className="p-1 hover:bg-gray-100 rounded focus-visible-ring transition-colors"
                      aria-label="Copy URL"
                      title="Copy URL"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {timeLeft}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDiscount(link.commissionPercent)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {link.conversions}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(link)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(link)}
                      className="p-2 hover:bg-green-50 rounded focus-visible-ring transition-colors"
                      aria-label="Edit"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => onDelete(link)}
                      className="p-2 hover:bg-red-50 rounded focus-visible-ring transition-colors"
                      aria-label="Delete"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}


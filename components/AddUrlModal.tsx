'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2, Check, ExternalLink, Copy } from 'lucide-react'
import { Platform, calculateExpiryTimestamp, formatExpiryDate, isValidUrl, generateAffiliateUrl } from '@/lib/affiliate-utils'
import { useAuth } from '@/lib/auth-context'

interface AddUrlModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editLink?: any
}

export function AddUrlModal({ isOpen, onClose, onSuccess, editLink }: AddUrlModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [maxCommission, setMaxCommission] = useState(15.0)

  // Form state
  const [platform, setPlatform] = useState<Platform>('WhatsApp')
  const [customPlatformName, setCustomPlatformName] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [expiryValue, setExpiryValue] = useState(30)
  const [expiryUnit, setExpiryUnit] = useState<'Hours' | 'Days' | 'Months'>('Days')
  const [commissionPercent, setCommissionPercent] = useState(5.0)
  const [tags, setTags] = useState('')

  useEffect(() => {
    if (isOpen) {
      // Fetch max commission
      fetch('/api/user/commission')
        .then((res) => res.json())
        .then((data) => setMaxCommission(data.affiliateCommissionPercent || 15.0))

      // If editing, populate form
      if (editLink) {
        setPlatform(editLink.platform as Platform)
        setCustomPlatformName(editLink.customPlatformName || '')
        setDestinationUrl(editLink.destinationUrl || '')
        setCommissionPercent(editLink.commissionPercent || 5.0)
        setTags(editLink.tags || '')
        // Calculate expiry value/unit from expiryUnix
        const now = Math.floor(Date.now() / 1000)
        const diff = editLink.expiryUnix - now
        if (diff > 0) {
          const days = Math.floor(diff / (24 * 60 * 60))
          if (days >= 30) {
            setExpiryValue(Math.floor(days / 30))
            setExpiryUnit('Months')
          } else {
            setExpiryValue(days)
            setExpiryUnit('Days')
          }
        }
        setStep(1)
      } else {
        // Reset form
        setPlatform('WhatsApp')
        setCustomPlatformName('')
        setDestinationUrl('')
        setExpiryValue(30)
        setExpiryUnit('Days')
        setCommissionPercent(5.0)
        setTags('')
        setStep(1)
      }
      setError(null)
    }
  }, [isOpen, editLink])

  if (!isOpen) return null

  const handleTestUrl = () => {
    if (destinationUrl && isValidUrl(destinationUrl)) {
      window.open(destinationUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const calculateExpiry = () => {
    return calculateExpiryTimestamp(expiryValue, expiryUnit)
  }

  const generatePreviewUrl = () => {
    const expiryUnix = calculateExpiry()
    return generateAffiliateUrl({
      userId: user?.email?.split('@')[0] || 'u_123',
      platform,
      destinationUrl,
      expiryUnix,
      commissionPercent,
      customPlatformName: platform === 'Custom' ? customPlatformName : undefined,
    })
  }

  const validateStep = (stepNumber: number): boolean => {
    setError(null)

    if (stepNumber === 1) {
      if (!platform) {
        setError('Platform is required')
        return false
      }
      if (platform === 'Custom' && !customPlatformName.trim()) {
        setError('Custom platform name is required')
        return false
      }
    } else if (stepNumber === 2) {
      if (!destinationUrl.trim()) {
        setError('Destination URL is required')
        return false
      }
      if (!isValidUrl(destinationUrl)) {
        setError('Please enter a valid URL (must start with http:// or https://)')
        return false
      }
    } else if (stepNumber === 3) {
      if (!expiryValue || expiryValue <= 0) {
        setError('Expiry value must be greater than 0')
        return false
      }
      const expiryUnix = calculateExpiry()
      if (expiryUnix <= Math.floor(Date.now() / 1000)) {
        setError('Expiry date must be in the future')
        return false
      }
    } else if (stepNumber === 4) {
      if (commissionPercent < 0 || commissionPercent > maxCommission) {
        setError(`Commission must be between 0 and ${maxCommission}%`)
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!validateStep(step)) return

    setIsLoading(true)
    setError(null)

    try {
      const expiryUnix = calculateExpiry()
      const url = generatePreviewUrl()

      const payload = {
        platform,
        destinationUrl,
        expiryUnix,
        commissionPercent,
        tags: tags.trim() || undefined,
        customPlatformName: platform === 'Custom' ? customPlatformName : undefined,
        userId: user?.email?.split('@')[0] || 'u_123',
      }

      const endpoint = editLink ? `/api/affiliate/${editLink.id}` : '/api/affiliate'
      const method = editLink ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save affiliate link')
      }

      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const expiryUnix = calculateExpiry()
  const previewUrl = destinationUrl && isValidUrl(destinationUrl) ? generatePreviewUrl() : ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-url-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 id="add-url-title" className="text-2xl font-bold text-gray-900">
            {editLink ? 'Edit Affiliate URL' : 'Add Affiliate URL'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus-visible-ring"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  <span className={`ml-2 text-sm ${step >= s ? 'text-primary font-medium' : 'text-gray-500'}`}>
                    {s === 1 ? 'Platform' : s === 2 ? 'URL' : s === 3 ? 'Expiry' : s === 4 ? 'Commission' : 'Preview'}
                  </span>
                </div>
                {s < 5 && <div className={`flex-1 h-0.5 mx-2 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Step 1: Platform */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                  Platform <span className="text-red-500">*</span>
                </label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              {platform === 'Custom' && (
                <div>
                  <label htmlFor="customPlatform" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Platform Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customPlatform"
                    value={customPlatformName}
                    onChange={(e) => setCustomPlatformName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., TikTok, LinkedIn"
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Destination URL */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="destinationUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Destination URL <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="destinationUrl"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/product"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleTestUrl}
                    disabled={!destinationUrl || !isValidUrl(destinationUrl)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors focus-visible-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Test
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">Enter the full URL where users should be redirected</p>
              </div>
            </div>
          )}

          {/* Step 3: Expiry */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={expiryValue}
                    onChange={(e) => setExpiryValue(parseInt(e.target.value) || 1)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <select
                    value={expiryUnit}
                    onChange={(e) => setExpiryUnit(e.target.value as 'Hours' | 'Days' | 'Months')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Expires on: <strong>{formatExpiryDate(expiryUnix)}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Commission */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Commission (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="commission"
                  min="0"
                  max={maxCommission}
                  step="0.1"
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maximum commission allowed: <strong>{maxCommission}%</strong>
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Optional Notes / Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., summer-campaign, product-launch"
                />
              </div>
            </div>
          )}

          {/* Step 5: Preview */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Platform</label>
                    <p className="text-gray-900">{platform === 'Custom' ? customPlatformName : platform}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Destination URL</label>
                    <p className="text-gray-900 break-all">{destinationUrl}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Expiry</label>
                    <p className="text-gray-900">{formatExpiryDate(expiryUnix)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Commission</label>
                    <p className="text-gray-900">{commissionPercent}%</p>
                  </div>
                  {tags && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tags</label>
                      <p className="text-gray-900">{tags}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Generated Affiliate URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={previewUrl}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(previewUrl)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors focus-visible-ring flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus-visible-ring"
              >
                Back
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors focus-visible-ring"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-secondary hover:bg-secondary-hover text-white rounded-lg font-medium transition-colors focus-visible-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editLink ? 'Save Changes' : 'Confirm & Create'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


/**
 * Affiliate URL generation and utility functions
 */

export type Platform = 'WhatsApp' | 'Facebook' | 'Instagram' | 'Telegram' | 'Email' | 'SMS' | 'Custom'

export const PLATFORM_SHORT_MAP: Record<Platform, string> = {
  WhatsApp: 'wa',
  Facebook: 'fb',
  Instagram: 'ig',
  Telegram: 'tg',
  Email: 'em',
  SMS: 'sms',
  Custom: 'custom',
}

export interface AffiliateUrlParams {
  userId: string
  platform: Platform
  destinationUrl: string
  expiryUnix: number
  commissionPercent: number
  customPlatformName?: string
}

export interface GeneratedAffiliateUrl {
  url: string
  platform: Platform
  destination: string
  expiryUnix: number
  commissionPercent: number
}

/**
 * Generate a canonical affiliate URL
 */
export function generateAffiliateUrl(params: AffiliateUrlParams): string {
  const { userId, platform, destinationUrl, expiryUnix, commissionPercent, customPlatformName } = params

  // Get platform short code
  const platformShort = PLATFORM_SHORT_MAP[platform]

  // Encode destination URL safely
  const encodedDest = encodeURIComponent(destinationUrl)

  // Build base URL (in production, this would come from env var)
  const baseUrl =
    (typeof window !== 'undefined' && window.location.origin) ||
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_AFFILIATE_BASE_URL) ||
    'https://example.com/aff'

  // Construct affiliate URL
  const affiliateUrl = `${baseUrl}/${userId}?p=${platformShort}&d=${encodedDest}&e=${expiryUnix}&c=${commissionPercent}`

  // If custom platform, add custom name to URL
  if (platform === 'Custom' && customPlatformName) {
    const encodedCustom = encodeURIComponent(customPlatformName)
    return `${affiliateUrl}&cn=${encodedCustom}`
  }

  return affiliateUrl
}

/**
 * Parse expiry unit and value to Unix timestamp
 */
export function calculateExpiryTimestamp(value: number, unit: 'Hours' | 'Days' | 'Months'): number {
  const now = Date.now()
  const milliseconds = {
    Hours: value * 60 * 60 * 1000,
    Days: value * 24 * 60 * 60 * 1000,
    Months: value * 30 * 24 * 60 * 60 * 1000, // Approximate: 30 days per month
  }

  return Math.floor((now + milliseconds[unit]) / 1000) // Return Unix timestamp (seconds)
}

/**
 * Format expiry timestamp to human-readable string
 */
export function formatExpiryDate(expiryUnix: number): string {
  const date = new Date(expiryUnix * 1000)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate time left from expiry timestamp
 */
export function calculateTimeLeft(expiryUnix: number): { value: number; unit: string; expired: boolean } {
  const now = Math.floor(Date.now() / 1000)
  const diff = expiryUnix - now

  if (diff <= 0) {
    return { value: 0, unit: 'Days', expired: true }
  }

  const days = Math.floor(diff / (24 * 60 * 60))
  const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((diff % (60 * 60)) / 60)

  if (days > 0) {
    return { value: days, unit: 'Days', expired: false }
  } else if (hours > 0) {
    return { value: hours, unit: 'Hours', expired: false }
  } else {
    return { value: minutes, unit: 'Minutes', expired: false }
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Truncate URL for display
 */
export function truncateUrl(url: string, maxLength: number = 30): string {
  if (url.length <= maxLength) return url
  return url.substring(0, maxLength) + '...'
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div')
  div.textContent = input
  return div.innerHTML
}


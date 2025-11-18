import {
  generateAffiliateUrl,
  calculateExpiryTimestamp,
  formatExpiryDate,
  calculateTimeLeft,
  isValidUrl,
  truncateUrl,
  PLATFORM_SHORT_MAP,
} from '@/lib/affiliate-utils'

describe('Affiliate Utils', () => {
  describe('generateAffiliateUrl', () => {
    it('should generate a valid affiliate URL', () => {
      const params = {
        userId: 'u_123',
        platform: 'WhatsApp' as const,
        destinationUrl: 'https://example.com/product',
        expiryUnix: 1234567890,
        commissionPercent: 10,
      }

      const url = generateAffiliateUrl(params)
      expect(url).toContain('/aff/u_123')
      expect(url).toContain('p=wa')
      expect(url).toContain('d=')
      expect(url).toContain('e=1234567890')
      expect(url).toContain('c=10')
    })

    it('should include custom platform name when platform is Custom', () => {
      const params = {
        userId: 'u_123',
        platform: 'Custom' as const,
        destinationUrl: 'https://example.com/product',
        expiryUnix: 1234567890,
        commissionPercent: 10,
        customPlatformName: 'TikTok',
      }

      const url = generateAffiliateUrl(params)
      expect(url).toContain('p=custom')
      expect(url).toContain('cn=')
    })

    it('should use correct platform short codes', () => {
      const platforms = ['WhatsApp', 'Facebook', 'Instagram', 'Telegram', 'Email', 'SMS'] as const
      platforms.forEach((platform) => {
        const params = {
          userId: 'u_123',
          platform,
          destinationUrl: 'https://example.com',
          expiryUnix: 1234567890,
          commissionPercent: 10,
        }
        const url = generateAffiliateUrl(params)
        expect(url).toContain(`p=${PLATFORM_SHORT_MAP[platform]}`)
      })
    })
  })

  describe('calculateExpiryTimestamp', () => {
    it('should calculate expiry for hours correctly', () => {
      const now = Date.now()
      const hours = 5
      const expiry = calculateExpiryTimestamp(hours, 'Hours')
      const expected = Math.floor((now + hours * 60 * 60 * 1000) / 1000)
      expect(expiry).toBe(expected)
    })

    it('should calculate expiry for days correctly', () => {
      const now = Date.now()
      const days = 7
      const expiry = calculateExpiryTimestamp(days, 'Days')
      const expected = Math.floor((now + days * 24 * 60 * 60 * 1000) / 1000)
      expect(expiry).toBe(expected)
    })

    it('should calculate expiry for months correctly', () => {
      const now = Date.now()
      const months = 2
      const expiry = calculateExpiryTimestamp(months, 'Months')
      const expected = Math.floor((now + months * 30 * 24 * 60 * 60 * 1000) / 1000)
      expect(expiry).toBe(expected)
    })
  })

  describe('formatExpiryDate', () => {
    it('should format expiry date correctly', () => {
      const expiryUnix = Math.floor(Date.now() / 1000) + 86400 // 1 day from now
      const formatted = formatExpiryDate(expiryUnix)
      expect(formatted).toBeTruthy()
      expect(typeof formatted).toBe('string')
    })
  })

  describe('calculateTimeLeft', () => {
    it('should return expired for past timestamps', () => {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 86400 // 1 day ago
      const result = calculateTimeLeft(pastTimestamp)
      expect(result.expired).toBe(true)
      expect(result.value).toBe(0)
    })

    it('should return correct days for future timestamps', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 7 * 86400 // 7 days from now
      const result = calculateTimeLeft(futureTimestamp)
      expect(result.expired).toBe(false)
      expect(result.value).toBe(7)
      expect(result.unit).toBe('Days')
    })

    it('should return hours for less than a day', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 5 * 3600 // 5 hours from now
      const result = calculateTimeLeft(futureTimestamp)
      expect(result.expired).toBe(false)
      expect(result.unit).toBe('Hours')
    })
  })

  describe('isValidUrl', () => {
    it('should validate HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true)
    })

    it('should validate HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('ftp://example.com')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })

  describe('truncateUrl', () => {
    it('should truncate long URLs', () => {
      const longUrl = 'https://example.com/very/long/path/that/exceeds/maximum/length'
      const truncated = truncateUrl(longUrl, 30)
      expect(truncated.length).toBeLessThanOrEqual(33) // 30 + '...'
      expect(truncated).toContain('...')
    })

    it('should not truncate short URLs', () => {
      const shortUrl = 'https://example.com'
      const truncated = truncateUrl(shortUrl, 30)
      expect(truncated).toBe(shortUrl)
    })
  })
})


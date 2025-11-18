/**
 * Shared in-memory store for affiliate links
 * In production, replace with database queries (PostgreSQL, MongoDB, etc.)
 */

export interface AffiliateLink {
  id: string
  userId: string
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

// In-memory store
let affiliateLinksStore: AffiliateLink[] = [
  // Seed with sample data matching screenshot
  {
    id: '1',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'WhatsApp',
    destinationUrl: 'https://example.com/product1',
    expiryUnix: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    commissionPercent: 5,
    isActive: true,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    conversions: 10,
  },
  {
    id: '2',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Instagram',
    destinationUrl: 'https://example.com/product2',
    expiryUnix: Math.floor(Date.now() / 1000) + 12 * 24 * 60 * 60,
    commissionPercent: 10,
    isActive: true,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    conversions: 23,
  },
  {
    id: '3',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Instagram',
    destinationUrl: 'https://example.com/product3',
    expiryUnix: Math.floor(Date.now() / 1000) + 22 * 24 * 60 * 60,
    commissionPercent: 12,
    isActive: true,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    conversions: 13,
  },
  {
    id: '4',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Instagram',
    destinationUrl: 'https://example.com/product4',
    expiryUnix: Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60,
    commissionPercent: 5,
    isActive: true,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    conversions: 45,
  },
  {
    id: '5',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Instagram',
    destinationUrl: 'https://example.com/product5',
    expiryUnix: Math.floor(Date.now() / 1000) + 22 * 24 * 60 * 60,
    commissionPercent: 5,
    isActive: true,
    createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    conversions: 15,
  },
  {
    id: '6',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Instagram',
    destinationUrl: 'https://example.com/product6',
    expiryUnix: Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60,
    commissionPercent: 15,
    isActive: true,
    createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
    conversions: 11,
  },
  {
    id: '7',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Instagram',
    destinationUrl: 'https://example.com/product7',
    expiryUnix: Math.floor(Date.now() / 1000) + 22 * 60 * 60,
    commissionPercent: 10,
    isActive: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    conversions: 10,
  },
  {
    id: '8',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Facebook',
    destinationUrl: 'https://example.com/product8',
    expiryUnix: Math.floor(Date.now() / 1000) - 24 * 60 * 60,
    commissionPercent: 5,
    isActive: false,
    createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
    conversions: 0,
  },
  {
    id: '9',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Facebook',
    destinationUrl: 'https://example.com/product9',
    expiryUnix: Math.floor(Date.now() / 1000) - 12 * 60 * 60,
    commissionPercent: 5,
    isActive: false,
    createdAt: Date.now() - 32 * 24 * 60 * 60 * 1000,
    conversions: 55,
  },
  {
    id: '10',
    userId: 'u_123',
    url: 'http://cdovsovvo...',
    platform: 'Facebook',
    destinationUrl: 'https://example.com/product10',
    expiryUnix: Math.floor(Date.now() / 1000) - 6 * 60 * 60,
    commissionPercent: 5,
    isActive: false,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    conversions: 15,
  },
]

export function getAffiliateLinks(): AffiliateLink[] {
  return affiliateLinksStore
}

export function setAffiliateLinks(links: AffiliateLink[]): void {
  affiliateLinksStore = links
}

export function getAffiliateLinkById(id: string): AffiliateLink | undefined {
  return affiliateLinksStore.find((link) => link.id === id)
}

export function addAffiliateLink(link: AffiliateLink): void {
  affiliateLinksStore.push(link)
}

export function updateAffiliateLink(id: string, updates: Partial<AffiliateLink>): AffiliateLink | null {
  const index = affiliateLinksStore.findIndex((link) => link.id === id)
  if (index === -1) return null

  affiliateLinksStore[index] = { ...affiliateLinksStore[index], ...updates }
  return affiliateLinksStore[index]
}

export function deleteAffiliateLink(id: string): boolean {
  const index = affiliateLinksStore.findIndex((link) => link.id === id)
  if (index === -1) return false

  affiliateLinksStore.splice(index, 1)
  return true
}


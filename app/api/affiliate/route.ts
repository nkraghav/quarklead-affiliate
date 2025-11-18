import { NextResponse } from 'next/server'
import {
  getAffiliateLinks,
  setAffiliateLinks,
  addAffiliateLink,
  type AffiliateLink,
} from '@/lib/affiliate-store'

// Get store
let affiliateLinksStore = getAffiliateLinks()

// Initialize store if empty
if (affiliateLinksStore.length === 0) {
  // Seed with sample data matching screenshot
  const seedData: AffiliateLink[] = [
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
    expiryUnix: Math.floor(Date.now() / 1000) + 22 * 60 * 60, // 22 hours
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
    expiryUnix: Math.floor(Date.now() / 1000) - 24 * 60 * 60, // Expired
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
    expiryUnix: Math.floor(Date.now() / 1000) - 12 * 60 * 60, // Expired
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
    expiryUnix: Math.floor(Date.now() / 1000) - 6 * 60 * 60, // Expired
    commissionPercent: 5,
    isActive: false,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    conversions: 15,
  },
  ]
  seedData.forEach((link) => addAffiliateLink(link))
  affiliateLinksStore = getAffiliateLinks()
}

/**
 * GET /api/affiliate
 * Returns list of affiliate links for the authenticated user
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get('platform')
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let filtered = [...getAffiliateLinks()]

  // Filter by platform
  if (platform && platform !== 'all') {
    filtered = filtered.filter((link) => link.platform === platform)
  }

  // Filter by status
  if (status === 'active') {
    filtered = filtered.filter((link) => link.isActive && link.expiryUnix > Math.floor(Date.now() / 1000))
  } else if (status === 'inactive') {
    filtered = filtered.filter((link) => !link.isActive || link.expiryUnix <= Math.floor(Date.now() / 1000))
  }

  // Search by URL, destination, or tags
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (link) =>
        link.url.toLowerCase().includes(searchLower) ||
        link.destinationUrl.toLowerCase().includes(searchLower) ||
        link.tags?.toLowerCase().includes(searchLower)
    )
  }

  // Sort by created date (newest first)
  filtered.sort((a, b) => b.createdAt - a.createdAt)

  return NextResponse.json(filtered)
}

/**
 * POST /api/affiliate
 * Creates a new affiliate link
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      platform,
      destinationUrl,
      expiryUnix,
      commissionPercent,
      tags,
      customPlatformName,
      userId = 'u_123', // In production, get from auth session
    } = body

    // Validation
    if (!platform || !destinationUrl || !expiryUnix || commissionPercent === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!isValidUrl(destinationUrl)) {
      return NextResponse.json({ error: 'Invalid destination URL' }, { status: 400 })
    }

    if (expiryUnix <= Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ error: 'Expiry must be in the future' }, { status: 400 })
    }

    if (commissionPercent < 0 || commissionPercent > 100) {
      return NextResponse.json({ error: 'Commission must be between 0 and 100' }, { status: 400 })
    }

    // Check user's maximum commission (fetch from user commission API)
    // For demo, assume max is 15%
    const maxCommission = 15.0
    if (commissionPercent > maxCommission) {
      return NextResponse.json(
        { error: `Commission cannot exceed your maximum commission of ${maxCommission}%` },
        { status: 400 }
      )
    }

    // Generate affiliate URL
    const { generateAffiliateUrl } = await import('@/lib/affiliate-utils')
    const affiliateUrl = generateAffiliateUrl({
      userId,
      platform,
      destinationUrl,
      expiryUnix,
      commissionPercent,
      customPlatformName,
    })

    // Create new affiliate link
    const newLink: AffiliateLink = {
      id: Date.now().toString(),
      userId,
      url: affiliateUrl,
      platform,
      destinationUrl,
      expiryUnix,
      commissionPercent,
      isActive: true,
      createdAt: Date.now(),
      tags: tags || undefined,
      conversions: 0,
      customPlatformName: customPlatformName || undefined,
    }

    addAffiliateLink(newLink)

    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create affiliate link' }, { status: 500 })
  }
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}


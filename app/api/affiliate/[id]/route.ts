import { NextResponse } from 'next/server'
import {
  getAffiliateLinks,
  getAffiliateLinkById,
  updateAffiliateLink,
  deleteAffiliateLink as removeAffiliateLink,
} from '@/lib/affiliate-store'

/**
 * GET /api/affiliate/[id]
 * Get a single affiliate link by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const link = getAffiliateLinkById(params.id)

    if (!link) {
      return NextResponse.json({ error: 'Affiliate link not found' }, { status: 404 })
    }

    return NextResponse.json(link)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch affiliate link' }, { status: 500 })
  }
}

/**
 * PUT /api/affiliate/[id]
 * Update an affiliate link
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const existingLink = getAffiliateLinkById(params.id)

    if (!existingLink) {
      return NextResponse.json({ error: 'Affiliate link not found' }, { status: 404 })
    }
    const {
      platform,
      destinationUrl,
      expiryUnix,
      commissionPercent,
      tags,
      customPlatformName,
      isActive,
    } = body

    // Validation
    if (destinationUrl && !isValidUrl(destinationUrl)) {
      return NextResponse.json({ error: 'Invalid destination URL' }, { status: 400 })
    }

    if (expiryUnix !== undefined && expiryUnix <= Math.floor(Date.now() / 1000)) {
      return NextResponse.json({ error: 'Expiry must be in the future' }, { status: 400 })
    }

    if (commissionPercent !== undefined && (commissionPercent < 0 || commissionPercent > 100)) {
      return NextResponse.json({ error: 'Commission must be between 0 and 100' }, { status: 400 })
    }

    // Regenerate URL if key fields changed
    let url = existingLink.url
    if (platform || destinationUrl || expiryUnix !== undefined || commissionPercent !== undefined) {
      const { generateAffiliateUrl } = await import('@/lib/affiliate-utils')
      url = generateAffiliateUrl({
        userId: existingLink.userId,
        platform: platform || existingLink.platform,
        destinationUrl: destinationUrl || existingLink.destinationUrl,
        expiryUnix: expiryUnix !== undefined ? expiryUnix : existingLink.expiryUnix,
        commissionPercent: commissionPercent !== undefined ? commissionPercent : existingLink.commissionPercent,
        customPlatformName: customPlatformName || existingLink.customPlatformName,
      })
    }

    // Update link
    const updates: any = {
      ...(platform && { platform }),
      ...(destinationUrl && { destinationUrl }),
      ...(expiryUnix !== undefined && { expiryUnix }),
      ...(commissionPercent !== undefined && { commissionPercent }),
      ...(tags !== undefined && { tags }),
      ...(customPlatformName !== undefined && { customPlatformName }),
      ...(isActive !== undefined && { isActive }),
      url,
    }

    const updatedLink = updateAffiliateLink(params.id, updates)

    if (!updatedLink) {
      return NextResponse.json({ error: 'Failed to update affiliate link' }, { status: 500 })
    }

    return NextResponse.json(updatedLink)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update affiliate link' }, { status: 500 })
  }
}

/**
 * DELETE /api/affiliate/[id]
 * Delete an affiliate link
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = removeAffiliateLink(params.id)

    if (!success) {
      return NextResponse.json({ error: 'Affiliate link not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete affiliate link' }, { status: 500 })
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


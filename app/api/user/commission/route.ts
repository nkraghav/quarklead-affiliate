import { NextResponse } from 'next/server'

/**
 * GET /api/user/commission
 * Returns the user's affiliate commission percentage
 */
export async function GET() {
  // Mock user commission - in production, fetch from database
  const commission = {
    userId: 'u_123',
    affiliateCommissionPercent: 15.0, // Maximum commission user can offer
  }

  return NextResponse.json(commission)
}


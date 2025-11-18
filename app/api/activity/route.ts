import { NextResponse } from 'next/server'

export async function GET() {
  // Mock activity data
  const activities = [
    {
      id: '1',
      type: 'profile_update',
      message: 'Profile updated successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      type: 'earnings',
      message: 'New commission earned: $250.00',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      type: 'referral',
      message: 'New referral signup: John Doe',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json(activities)
}


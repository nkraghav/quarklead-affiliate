import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Mock update - in production, this would update a database
    const updatedProfile = {
      name: body.name || 'Ravi Gupta',
      email: body.email || 'ravi@gmail.com',
      mobile: body.mobile || '+91 8523697410',
      address: body.address || 'Noida, UP',
      dateOfBirth: body.dateOfBirth || 'January 1, 1990',
      avatarUrl: body.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi',
      verified: body.verified !== undefined ? body.verified : true,
      updatedAt: new Date().toISOString(),
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(updatedProfile, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}


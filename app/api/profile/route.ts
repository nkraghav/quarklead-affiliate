import { NextResponse } from 'next/server'

export async function GET() {
  // Mock profile data
  const profile = {
    name: 'Ravi Gupta',
    email: 'ravi@gmail.com',
    mobile: '+91 8523697410',
    address: 'Noida, UP',
    dateOfBirth: 'January 1, 1990',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi',
    verified: true,
  }

  return NextResponse.json(profile)
}


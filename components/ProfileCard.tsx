'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Calendar, User, CheckCircle2, Edit2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { EditProfileModal } from './EditProfileModal'

interface ProfileData {
  name: string
  email: string
  mobile: string
  address: string
  dateOfBirth: string
  avatarUrl: string
  verified: boolean
}

interface ProfileCardProps {
  profile: ProfileData
  onUpdate?: (updatedProfile: Partial<ProfileData>) => void
}

export function ProfileCard({ profile, onUpdate }: ProfileCardProps) {
  const { user } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleUpdate = (updatedProfile: Partial<ProfileData>) => {
    onUpdate?.(updatedProfile)
    setIsEditModalOpen(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-secondary hover:bg-secondary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors focus-visible-ring flex items-center gap-2 shadow-sm"
            aria-label="Update profile"
          >
            <Edit2 className="w-4 h-4" />
            Update Profile
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 w-full md:w-auto">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-100 shadow-sm">
              <Image
                src={profile.avatarUrl || '/api/placeholder/128/128'}
                alt={`${profile.name}'s avatar`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{profile.name}</h2>
              {profile.verified && (
                <CheckCircle2 className="w-6 h-6 text-accent-blue" aria-label="Verified" fill="currentColor" />
              )}
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="flex-1 w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  <span className="font-medium">Email :</span> {profile.email}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  <span className="font-medium">Mobile :</span> {profile.mobile}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  <span className="font-medium">Address :</span> {profile.address}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  <span className="font-medium">Date of Birth :</span> {profile.dateOfBirth}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="text-gray-700">
                  <span className="font-medium">Name :</span> {profile.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleUpdate}
      />
    </>
  )
}


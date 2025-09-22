"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingPage } from '@/components/ui/loading'
import { useCurrentUserProfile, useUpdateProfile } from '@/hooks/useProfile'
import { CreateProfileModal } from '@/components/profile/CreateProfileModal'
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Lock, AlertCircle } from 'lucide-react'

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    userType: '',
    createdAt: '',
    photo: '',
    degree: '',
    department: '',
    experience: '',
    availability: '',
    salary_expectation: ''
  })
  const [updateMessage, setUpdateMessage] = useState('')
  const [showCreateProfile, setShowCreateProfile] = useState(false)

  const { profile, loading: profileLoading, error: profileError } = useCurrentUserProfile()
  const { updateProfile, loading: updateLoading } = useUpdateProfile()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        userType: user.user_type || '',
        createdAt: new Date(user.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
      }))
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        location: profile.location || '',
        address: profile.address || '',
        photo: profile.photo || '',
        degree: profile.degree || '',
        department: profile.department || '',
        experience: profile.experience?.toString() || '',
        availability: profile.availability || '',
        salary_expectation: profile.salary_expectation?.toString() || ''
      }))
    }
  }, [profile])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setUpdateMessage('');
      await updateProfile(user.id, {
        location: profileData.location,
        address: profileData.address,
        degree: profileData.degree,
        department: profileData.department,
        experience: profileData.experience ? parseInt(profileData.experience) : undefined,
        availability: profileData.availability as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | undefined,
        salary_expectation: profileData.salary_expectation ? parseInt(profileData.salary_expectation) : undefined,
      });
      
      setUpdateMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setUpdateMessage('Failed to update profile. Please try again.');
    }
  }

  const handleCancel = () => {
    // Reset to original profile data
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        userType: user.user_type || '',
        createdAt: new Date(user.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
      }))
    }
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        location: profile.location || '',
        address: profile.address || '',
        photo: profile.photo || '',
        degree: profile.degree || '',
        department: profile.department || '',
        experience: profile.experience?.toString() || '',
        availability: profile.availability || '',
        salary_expectation: profile.salary_expectation?.toString() || ''
      }))
    }
    setIsEditing(false)
    setUpdateMessage('')
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    setPasswordError('')
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setIsChangingPassword(true)

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required')
      setIsChangingPassword(false)
      return
    }

    if (!passwordData.newPassword) {
      setPasswordError('New password is required')
      setIsChangingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      setIsChangingPassword(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      setIsChangingPassword(false)
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset form and close modal
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setShowChangePassword(false)
    setIsChangingPassword(false)
    
    // You could show a success message here
  }

  const handleClosePasswordModal = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
    setShowChangePassword(false)
  }

  if (authLoading || profileLoading) {
    return <LoadingPage />
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile</p>
          <Button onClick={() => router.push('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{profileError}</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.reload()} className='cursor-pointer'>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className='cursor-pointer'>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show create profile modal if no profile exists
  if (!profileLoading && !profile && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load profile</h2>
          <p className="text-gray-600 mb-4">Please try again later</p>
          <div className="space-x-4">

            <Button onClick={() => router.push('/')} variant="outline" className='cursor-pointer'>
              Go to Home
            </Button>
          </div>
        </div>
        
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
          
          {/* Update Message */}
          {updateMessage && (
            <div className={`mt-4 p-4 rounded-lg ${
              updateMessage.includes('successfully') 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {updateMessage}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.photo} alt={profileData.name || 'User'} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{profileData.name}</CardTitle>
                <p className="text-gray-600 capitalize">{profileData.userType}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member since {profileData.createdAt}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {profileData.location || 'Not specified'}
                  </div>
                  {profileData.degree && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {profileData.degree}
                    </div>
                  )}
                  {profileData.experience && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {profileData.experience} years experience
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleEdit}
                      className="cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCancel}
                        className="cursor-pointer"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleSave}
                        disabled={updateLoading}
                        className="cursor-pointer"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className='mb-2'>Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{profileData.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className='mb-2'>Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{profileData.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className='mb-2'>Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="09xxxxxxxx or +2519xxxxxxxx"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900">{profileData.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="userType" className='mb-2'>Account Type</Label>
                      {isEditing ? (
                        <Select value={profileData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buyer">House Buyer</SelectItem>
                            <SelectItem value="seller">House Seller</SelectItem>
                            <SelectItem value="employee">Job Seeker</SelectItem>
                            <SelectItem value="employer">Employer</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-900 capitalize">{profileData.userType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className='mb-2'>Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{profileData.location || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address" className='mb-2'>Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-gray-900">{profileData.address || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  {/* Employee-specific fields */}
                  {profileData.userType === 'EMPLOYEE' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="degree" className='mb-2'>Degree/Education</Label>
                          {isEditing ? (
                            <Input
                              id="degree"
                              value={profileData.degree}
                              onChange={(e) => handleInputChange('degree', e.target.value)}
                              placeholder="e.g., BSc Computer Science"
                            />
                          ) : (
                            <div className="flex items-center mt-1">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-gray-900">{profileData.degree || 'Not specified'}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="department" className='mb-2'>Department</Label>
                          {isEditing ? (
                            <Input
                              id="department"
                              value={profileData.department}
                              onChange={(e) => handleInputChange('department', e.target.value)}
                              placeholder="e.g., IT, Marketing"
                            />
                          ) : (
                            <div className="flex items-center mt-1">
                              <User className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-gray-900">{profileData.department || 'Not specified'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="experience" className='mb-2'>Years of Experience</Label>
                          {isEditing ? (
                            <Input
                              id="experience"
                              type="number"
                              value={profileData.experience}
                              onChange={(e) => handleInputChange('experience', e.target.value)}
                              placeholder="e.g., 5"
                            />
                          ) : (
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-gray-900">{profileData.experience ? `${profileData.experience} years` : 'Not specified'}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="availability" className='mb-2'>Availability</Label>
                          {isEditing ? (
                            <Select value={profileData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                <SelectItem value="PART_TIME">Part Time</SelectItem>
                                <SelectItem value="CONTRACT">Contract</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="flex items-center mt-1">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-gray-900">{profileData.availability || 'Not specified'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="salary_expectation" className='mb-2'  >Salary Expectation (ETB)</Label>
                        {isEditing ? (
                          <Input
                            id="salary_expectation"
                            type="number"
                            value={profileData.salary_expectation}
                            onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                            placeholder="e.g., 15000"
                          />
                        ) : (
                          <div className="flex items-center mt-1">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-gray-900">{profileData.salary_expectation ? `ETB ${parseInt(profileData.salary_expectation).toLocaleString()}` : 'Not specified'}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => router.push('/houses')}
                  >
                    Browse Properties
                  </Button>
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => router.push('/jobs')}
                  >
                    Find Jobs
                  </Button>
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 z-10 cursor-pointer"
              onClick={handleClosePasswordModal}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <p className="text-sm text-gray-600">
                Enter your current password and choose a new one
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className='mb-2'>Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter your current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className='mb-2'>New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password (min 6 characters)"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className='mb-2' >Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
                
                {passwordError && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {passwordError}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={handleClosePasswordModal}
                    disabled={isChangingPassword}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 cursor-pointer" 
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
      
      {/* Create Profile Modal */}
      <CreateProfileModal
        isOpen={showCreateProfile}
        onClose={() => setShowCreateProfile(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  )
}
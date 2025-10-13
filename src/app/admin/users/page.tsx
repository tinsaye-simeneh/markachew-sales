"use client"

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  UserCheck,
  UserX,
  Mail,
  Calendar,
  UserPlus,
  X,
  Shield,
  RefreshCcw
} from 'lucide-react'
import { useAdminUsers } from '@/hooks/useAdminApi'
import { UserType, adminAuthService } from '@/lib/api'
import { toast } from 'sonner'
import { DataDisplay, DataDisplayColumn } from '@/components/ui/data-display'
import type { AdminUser } from '@/lib/api/admin-services'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [adminModal, setAdminModal] = useState({
    isOpen: false
  })
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    users,
    total,
    loading,
    deleteUser,
    suspendUser,
    activateUser,
    toggleUserStatus,
    refetchUsers
  } = useAdminUsers({})

  const isSuperAdmin = user?.user_type === 'SUPER_ADMIN'

  const openAdminModal = () => {
    setAdminModal({ isOpen: true })
    setError('')
  }

  const closeAdminModal = () => {
    setAdminModal({ isOpen: false })
    setAdminFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'ADMIN'
    })
    setError('')
  }

  const validateAdminForm = (): boolean => {
    if (!adminFormData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!adminFormData.password) {
      setError('Password is required')
      return false
    }
    if (adminFormData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }
    if (adminFormData.password !== adminFormData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleAdminInputChange = (field: string, value: string) => {
    setAdminFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateAdminForm()) {
      return
    }

    setIsLoading(true)
    try {
      const success = await adminAuthService.createAdmin({
        email: adminFormData.email,
        password: adminFormData.password,
        role: adminFormData.role as 'ADMIN'
      })
    
      if (success) {
        toast.success('Admin created successfully', {
          description: 'The new admin has been registered and can now log in.'
        })
        closeAdminModal()
        // Refresh the users list
        window.location.reload()
      } else {
        setError('Failed to create admin. Please try again.')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create admin'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserAction = async (action: string, userId: string, reason?: string) => {
    try {
      setIsLoading(true)
      switch (action) {
        case 'toggle':
          await toggleUserStatus(userId)
          toast.success('User status updated successfully')
          break
        case 'activate':
          await activateUser(userId)
          break
        case 'suspend':
          await suspendUser(userId, reason || 'Administrative action')
          break
        case 'delete':
          if (confirm('Are you sure you want to delete this user?')) {
            await deleteUser(userId)
          }
          break
      }
      refetchUsers()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error performing user action', {
        description: 'Error performing user action'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    refetchUsers()
  }

  const getStatusBadge = (status: boolean) => {
    const variants = {
      true: 'default',
      false: 'secondary',
    } as const

    return (
      <Badge variant={variants[status as unknown as keyof typeof variants] || 'secondary'}>
          {status ? 'Active' : 'Inactive'}
      </Badge>
    )
  }

  const columns: DataDisplayColumn[] = [
    {
      key: 'full_name',
      label: 'User',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {value?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{value || 'Unknown'}</div>
            <div className="text-sm text-gray-500">{value}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span>{value || 'Unknown'}</span>
        </div>
      )
    },
    {
      key: 'user_type',
      label: 'Type',
      filterable: true,
      filterOptions: [
        { value: UserType.EMPLOYEE, label: 'Employee' },
        { value: UserType.EMPLOYER, label: 'Employer' },
        { value: UserType.SELLER, label: 'Seller' },
        { value: UserType.BUYER, label: 'Buyer' }
      ],
      render: (value) => (
        <Badge variant={value === 'EMPLOYER' ? 'default' : 'secondary'}>
          {value || 'Unknown'}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ],
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ]

  const getActionsForUser = (user: AdminUser) => {
    return [
      {
        key: 'toggle',
        label: user.status === true ? 'Suspend' : 'Activate',
        icon: user.status === true ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />,
        onClick: () => handleUserAction('toggle', user.id),
        className: user.status === true ? 'cursor-pointer text-red-600' : 'cursor-pointer text-green-600'
      }
    ]
  }


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage all users in the system</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2 cursor-pointer"
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-4 w-4 text-black" />
            Refresh
          </Button>
          {isSuperAdmin && (
            <Button 
              onClick={openAdminModal}
              className="flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Add Admin
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current page active users</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.status === true).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {total > 0 ? Math.round((users.filter(u => u.status === true).length / total) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>
         
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current page suspended users</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.status === false).length}
              </div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </CardContent>
          </Card>
        </div>

        <DataDisplay
          data={users}
          columns={columns}
          actions={getActionsForUser}
          loading={isLoading || loading}
          title="Current Page Users"
          description="A list of current page users in the system"
          defaultView="table"
          emptyMessage="No users found. User accounts will appear here."
          searchPlaceholder="Search users by email or type..."
          searchFields={['full_name', 'email', 'user_type']}
          itemsPerPage={5}
          totalItems={users.length}
          onItemClick={() => {
          }}
        />

        {/* Add Admin Modal */}
        {adminModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Add New Admin</CardTitle>
                      <p className="text-sm text-gray-600">Create a new admin account</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeAdminModal}
                    className="cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleAdminSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={adminFormData.email}
                        onChange={(e) => handleAdminInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={adminFormData.password}
                        onChange={(e) => handleAdminInputChange('password', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={adminFormData.confirmPassword}
                        onChange={(e) => handleAdminInputChange('confirmPassword', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Admin Role</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      This user will have administrative privileges to manage the system.
                    </p>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                      <div className="font-medium">Registration Failed</div>
                      <div className="mt-1">{error}</div>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1 cursor-pointer" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating Admin...' : 'Create Admin'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={closeAdminModal}
                      disabled={isLoading}
                      className='cursor-pointer'
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
} 
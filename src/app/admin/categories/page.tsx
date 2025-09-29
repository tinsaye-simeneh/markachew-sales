"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CategoryManagement } from '@/components/admin/CategoryManagement'
import { useCategories, useCreateCategory } from '@/hooks/useAdminApi'
import { LoadingPage } from '@/components/ui/loading'
import { UserType } from '@/lib/api'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminCategoriesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { } = useCategories()
  const { createCategory, loading: createLoading } = useCreateCategory()
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  useEffect(() => {
    if (!isLoading && (!user || (user.user_type !== UserType.ADMIN && user.user_type !== UserType.SUPER_ADMIN))) {
      router.push('/')
    }
  }, [user, isLoading, router])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      await createCategory({ name: newCategoryName.trim() })
      toast.success('Category created successfully')
      setNewCategoryName('')
      setIsCreateModalOpen(false) 
      window.location.reload()
    } catch (error) {
      console.error('Failed to create category:', error)
      toast.error('Failed to create category')
    }
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (!user || (user.user_type !== UserType.ADMIN && user.user_type !== UserType.SUPER_ADMIN)) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage house categories</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className='cursor-pointer'>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <Card>
        
          <CardContent>
            <CategoryManagement />
          </CardContent>
        </Card>

        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Create New Category</CardTitle>
                <CardDescription>Add a new house category</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <Label htmlFor="category-name" className='mb-2'>Category Name</Label>
                    <Input
                      id="category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        setNewCategoryName('')
                      }}
                      className='cursor-pointer'
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createLoading} className='cursor-pointer'>
                      {createLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Create Category
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
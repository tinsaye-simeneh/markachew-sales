"use client"

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCategories, useUpdateCategory, useDeleteCategory } from '@/hooks/useAdminApi'
import { Category } from '@/lib/api/config'
import { 
  Edit, 
  Trash2, 
  Tag,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { ConfirmationModal } from '../ui/confirmation-modal'

interface CategoryManagementProps {
  showSearch?: boolean
  onCategorySelect?: (category: Category) => void
  selectedCategoryId?: string
}

export function CategoryManagement({ 
  showSearch = true, 
  onCategorySelect,
  selectedCategoryId 
}: CategoryManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  const { categories, loading, error, refetch } = useCategories()
  const { updateCategory, loading: updateLoading } = useUpdateCategory()
  const { loading: deleteLoading } = useDeleteCategory()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

  // Reset to first page when search term changes
  useMemo(() => {
    setCurrentPage(1)
  }, [])

  
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory || !editCategoryName.trim()) return

    try {
      await updateCategory(editingCategory.id, { name: editCategoryName.trim() })
      setEditingCategory(null)
      setEditCategoryName('')
      refetch()
    } catch (error) {
      console.error('Failed to update category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    setCategoryToDelete(categoryId as unknown as Category)
    setIsDeleteModalOpen(true)
  }

  const startEdit = (category: Category) => {
    setEditingCategory(category)
    setEditCategoryName(category.name)
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setEditCategoryName('')
  }

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading categories...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 mb-2">Error: {error}</p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="grid gap-3">
        {paginatedCategories.length > 0 ? (
          paginatedCategories.map((category) => (
            <div 
              key={category.id} 
              className={`group relative bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                selectedCategoryId === category.id 
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {editingCategory?.id === category.id ? (
                <div className="p-4">
                  <form onSubmit={handleUpdateCategory} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        placeholder="Category name"
                        required
                        className="border-gray-300 focus:border-primary focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        size="sm" 
                        disabled={updateLoading} 
                        className="bg-primary hover:bg-primary/90 text-white"
                      >
                        {updateLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Save'
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={cancelEdit}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedCategoryId === category.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        <Tag className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-xs text-gray-500">
                          Created {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {selectedCategoryId === category.id && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          Selected
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEdit(category)
                          }}
                          className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCategory(category.id)
                          }}
                          disabled={deleteLoading}
                          className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Tag className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms to find what you\'re looking for.' 
                : 'Get started by creating your first category to organize your content.'
              }
            </p>
           
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCategories.length > itemsPerPage && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} categories
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteCategory(categoryToDelete?.id || '')}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  )
}
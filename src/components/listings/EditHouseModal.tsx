"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { housesService } from '@/lib/api'
import { House, CreateHouseRequest } from '@/lib/api'
import { AlertCircle, X } from 'lucide-react'
import { toast } from 'sonner'

interface EditHouseModalProps {
  isOpen: boolean
  onClose: () => void
  house: House | null
  onSuccess: () => void
}

export function EditHouseModal({ isOpen, onClose, house, onSuccess }: EditHouseModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    category_id: ''
  })

  // Initialize form data when house changes
  useEffect(() => {
    if (house) {
      try {
        const features = JSON.parse(house.features || '{}')
        setFormData({
          title: house.title || '',
          description: house.description || '',
          type: house.type || '',
          price: house.price || '',
          location: house.location || '',
          area: features.area || house.area || '',
          bedrooms: features.bedrooms || '',
          bathrooms: features.bathrooms || '',
          category_id: house.category_id || ''
        })
      } catch {
        setFormData({
          title: house.title || '',
          description: house.description || '',
          type: house.type || '',
          price: house.price || '',
          location: house.location || '',
          area: house.area || '',
          bedrooms: '',
          bathrooms: '',
          category_id: house.category_id || ''
        })
      }
    }
  }, [house])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!house) return

    setLoading(true)
    setError('')

    try {
      const houseData: Partial<CreateHouseRequest> = {
        title: formData.title,
        type: formData.type as 'SALES' | 'RENT',
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        category_id: formData.category_id,
      }

      await housesService.updateHouse(house.id, houseData)
      
      toast.success("House updated successfully!")
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to update house:', error)
      setError(error instanceof Error ? error.message : 'Failed to update house')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !house) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Edit House</CardTitle>
              <CardDescription>
                Update the house details
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="title" className='mb-2'>Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Beautiful 3BR Villa in Bole"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className='mb-2'>Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the property..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007a7f] focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className='mb-2'>Property Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className='cursor-pointer'>
                    <SelectValue placeholder="Select property type"  className='cursor-pointer'/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SALES" className='cursor-pointer'>For Sale</SelectItem>
                    <SelectItem value="RENT" className='cursor-pointer'>For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price" className='mb-2'>Price (ETB) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="e.g., 5000000"
                  required 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className='mb-2'>Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Bole, Addis Ababa"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="area" className='mb-2'>Area (sqft)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="e.g., 150"
                />
              </div>

              <div>
                <Label htmlFor="bedrooms" className='mb-2'>Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms" className='mb-2'>Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? 'Updating...' : 'Update House'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
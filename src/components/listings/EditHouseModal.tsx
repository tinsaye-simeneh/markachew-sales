"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { housesService } from '@/lib/api'
import { House, CreateHouseRequest } from '@/lib/api'
import { 
  AlertCircle, 
  X, 
  Home,
  Tag,
  Ruler,
  Calendar,
  CheckCircle,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

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
    type: '',
    price: '',
    location: '',
    category_id: ''
  })
  const [description, setDescription] = useState('')
  const [area, setArea] = useState('')
  const [availabilityDate, setAvailabilityDate] = useState('')
  const [status, setStatus] = useState('active')
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const { user } = useAuth()
  useEffect(() => {
    if (house) {
      try {
        let parsedFeatures: string[] = []
        if (Array.isArray(house.features)) {
          parsedFeatures = house.features
        } else if (typeof house.features === 'string') {
          parsedFeatures = JSON.parse(house.features || '[]')
        }
        
        setFormData({
          title: house.title || '',
          type: house.type || '',
          price: house.price?.toString() || '',
          location: house.location || '',
          category_id: house.category_id || ''
        })
        
        setDescription(house.description || '')
        setArea(house.area?.toString() || '')
        setAvailabilityDate(house.availability_date || '')
        setStatus(house.status || 'active')
        setFeatures(parsedFeatures)
      } catch (error) {
        console.error('Error parsing house data:', error)
        setFormData({
          title: house.title || '',
          type: house.type || '',
          price: house.price?.toString() || '',
          location: house.location || '',
          category_id: house.category_id || ''
        })
        setDescription(house.description || '')
        setArea(house.area?.toString() || '')
        setAvailabilityDate(house.availability_date || '')
        setStatus(house.status || 'active')
        setFeatures([])
      }
    }
  }, [house])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFeature()
    }
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
        description: description || undefined,
        area: area ? parseFloat(area) : undefined,
        availability_date: availabilityDate || undefined,
        features: features.length > 0 ? features : undefined,
        status: status
      }

      await housesService.updateHouse(house.id, houseData)
      
      toast.success("House updated successfully!")
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to update house', {
        description: 'Failed to update house'
      })
      setError(error instanceof Error ? error.message : 'Failed to update house')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !house) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>Edit Property</CardTitle>
                <CardDescription>
                  Update the property details
                </CardDescription>
              </div>
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update the essential details about the property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Beautiful 3BR House in Downtown"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Listing Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SALES">For Sale</SelectItem>
                        <SelectItem value="RENT">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ETB) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 2500000"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Bole, Addis Ababa"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Describe your property, its features, and what makes it special..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="area" className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Area (sq ft)
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="e.g., 1200"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Availability Date
                    </Label>
                    <Input
                      id="availability"
                      type="date"
                      value={availabilityDate}
                      onChange={(e) => setAvailabilityDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Status *
                  </Label>
                  <Select
                    value={status}
                    onValueChange={setStatus}
                    disabled={user?.user_type !== 'ADMIN' && user?.user_type !== 'SUPER_ADMIN'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Property Features
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Swimming Pool, Garden, Parking"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button
                      type="button"
                      onClick={addFeature}
                      disabled={!newFeature.trim()}
                      className="cursor-pointer"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          <span>{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            className="h-4 w-4 p-0 hover:bg-primary/20 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className='cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 cursor-pointer"
              >
                {loading ? 'Updating...' : 'Update Property'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  X, 
  Copy, 
  Facebook, 
  Twitter, 
  Linkedin,
  MessageCircle,
  Mail,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  url: string
  description?: string
}

export function ShareModal({ isOpen, onClose, title, url, description }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description || '')

    let shareUrl = ''
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
        break
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
        break
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold">Share {title}</h3>
              <p className="text-sm text-gray-600">Share this with your network</p>
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

          {/* Copy Link Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <div className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate">
                {url}
              </div>
              <Button
                onClick={handleCopyLink}
                variant={copied ? "default" : "outline"}
                size="sm"
                className="cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Share on Social Media</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleSocialShare('facebook')}
                variant="outline"
                className="cursor-pointer justify-start"
              >
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                Facebook
              </Button>
              
              <Button
                onClick={() => handleSocialShare('twitter')}
                variant="outline"
                className="cursor-pointer justify-start"
              >
                <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                Twitter
              </Button>
              
              <Button
                onClick={() => handleSocialShare('linkedin')}
                variant="outline"
                className="cursor-pointer justify-start"
              >
                <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                LinkedIn
              </Button>
              
              <Button
                onClick={() => handleSocialShare('whatsapp')}
                variant="outline"
                className="cursor-pointer justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                WhatsApp
              </Button>
              
              <Button
                onClick={() => handleSocialShare('telegram')}
                variant="outline"
                className="cursor-pointer justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                Telegram
              </Button>
              
              <Button
                onClick={() => handleSocialShare('email')}
                variant="outline"
                className="cursor-pointer justify-start"
              >
                <Mail className="h-4 w-4 mr-2 text-gray-600" />
                Email
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full cursor-pointer"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
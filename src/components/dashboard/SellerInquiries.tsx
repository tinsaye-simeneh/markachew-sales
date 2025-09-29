"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataDisplay, DataDisplayColumn, DataDisplayAction } from '@/components/ui/data-display'
import { Inquiry } from '@/lib/api/config'
import { 
  User, 
  Phone, 
  Calendar,
  CheckCircle,
  XCircle,
  MessageCircle,
  Send,
  X
} from 'lucide-react'

interface SellerInquiriesProps {
  inquiries: Inquiry[] | null
  loading: boolean
  onUpdateInquiry: (inquiryId: string, status: string) => void
}

export function SellerInquiries({ inquiries, loading, onUpdateInquiry }: SellerInquiriesProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState<Array<{
    id: string
    sender: 'seller' | 'buyer'
    message: string
    timestamp: Date
    senderName: string
  }>>([])

  const handleStatusUpdate = async (inquiryId: string, status: string) => {
    try {
      setUpdatingId(inquiryId)
      await onUpdateInquiry(inquiryId, status)
    } catch (error) {
      console.error('Failed to update inquiry:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleOpenChat = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setChatOpen(true)
    // Initialize with some sample messages for demo
    setMessages([
      {
        id: '1',
        sender: 'buyer',
        message: `Hi! I'm interested in your property. Could you tell me more about it?`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        senderName: inquiry.user?.full_name || 'Buyer'
      },
      {
        id: '2',
        sender: 'seller',
        message: 'Hello! Thank you for your interest. This is a beautiful 3-bedroom house in a great location. Would you like to schedule a viewing?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        senderName: 'You'
      },
      {
        id: '3',
        sender: 'buyer',
        message: 'Yes, that would be great! When would be a good time for you?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        senderName: inquiry.user?.full_name || 'Buyer'
      }
    ])
  }

  const handleCloseChat = () => {
    setChatOpen(false)
    setSelectedInquiry(null)
    setMessages([])
    setNewMessage('')
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedInquiry) {
      const message = {
        id: Date.now().toString(),
        sender: 'seller' as const,
        message: newMessage.trim(),
        timestamp: new Date(),
        senderName: 'You'
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'PENDING':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  // Define columns for DataDisplay
  const columns: DataDisplayColumn[] = [
    {
      key: 'user.full_name',
      label: 'Buyer',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-100 rounded-full">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{item.user?.full_name || 'Unknown User'}</div>
            <div className="text-sm text-gray-500">{item.user?.email || 'No email'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'house.title',
      label: 'Property',
      sortable: true,
      render: (value, item) => (
        <div>
          <div className="font-medium text-gray-900">{item.house?.title || 'Unknown Property'}</div>
          <div className="text-sm text-gray-500">Property Inquiry</div>
        </div>
      )
    },
    {
      key: 'user.phone',
      label: 'Contact',
      render: (value, item) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          {item.user?.phone || 'No phone'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'REJECTED', label: 'Rejected' },
      ],
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      label: 'Inquired',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {new Date(value).toLocaleDateString()}
        </div>
      )
    }
  ]

  // Define actions for DataDisplay
  const getActionsForInquiry = (inquiry: Inquiry): DataDisplayAction[] => {
    const actions: DataDisplayAction[] = [
      {
        key: 'chat',
        label: 'Chat',
        icon: <MessageCircle className="h-4 w-4" />,
        onClick: () => handleOpenChat(inquiry),
        className: 'text-blue-600'
      }
    ]

    if (inquiry.status === 'PENDING') {
      actions.push(
        {
          key: 'accept',
          label: 'Accept',
          icon: <CheckCircle className="h-4 w-4" />,
          onClick: () => handleStatusUpdate(inquiry.id, 'ACCEPTED'),
          className: 'text-green-600'
        },
        {
          key: 'reject',
          label: 'Reject',
          icon: <XCircle className="h-4 w-4" />,
          onClick: () => handleStatusUpdate(inquiry.id, 'REJECTED'),
          className: 'text-red-600'
        }
      )
    }

    return actions
  }
  // Remove the loading check since DataDisplay handles loading internally

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiries</h1>
        <p className="text-gray-600">Review and manage property inquiries</p>
      </div>

      <DataDisplay
        data={inquiries || []}
        columns={columns}
        actions={getActionsForInquiry}
        loading={loading && !inquiries}
        title="Property Inquiries"
        description="Manage inquiries from potential buyers"
        defaultView="table"
        emptyMessage="No inquiries found. Inquiries for your property listings will appear here."
        searchPlaceholder="Search inquiries by buyer name, property, or status..."
        searchFields={['user.full_name', 'user.email', 'house.title', 'status']}   
        totalItems={inquiries?.length || 0}
        showFilters={true}
        itemsPerPage={10}
        onItemClick={() => {
        }}
      />

      {/* Chat Popup */}
      {chatOpen && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedInquiry.user?.full_name || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Property Inquiry Chat
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseChat}
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender === 'seller'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.senderName}
                    </div>
                    <div className="text-sm">{message.message}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'seller' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
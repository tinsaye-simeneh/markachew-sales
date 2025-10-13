"use client"

import { useState, useEffect } from 'react'
import { DataDisplay, DataDisplayColumn, DataDisplayAction } from '@/components/ui/data-display'
import { Inquiry } from '@/lib/api/config'
import { ChatModal } from '@/components/chat/ChatModal'
import { chatService, ChatRoom } from '@/lib/api/chat-service'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { 
  User, 
  Calendar,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
interface SellerInquiriesProps {
  inquiries?: Inquiry[] | null
  loading?: boolean
}

export function SellerInquiries({ 
  inquiries, 
  loading = false, 
}: SellerInquiriesProps) {
  const { user } = useAuth()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [isLoadingChatRooms, setIsLoadingChatRooms] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [chatroomId, setChatroomId] = useState<string | null>(null)
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!user) {
        return
      }
      
      setIsLoadingChatRooms(true)
      try {
        const rooms = await chatService.getMyChatRooms()
        setChatRooms(rooms)
      } catch (error) {
        console.error('Error fetching chat rooms:', error)
        toast.error('Failed to load chat rooms')
      } finally {
        setIsLoadingChatRooms(false)
      }
    }

    fetchChatRooms()
  }, [user])

  const convertChatRoomToInquiry = (chatRoom: ChatRoom): Inquiry => {
    const otherUser = user?.id === chatRoom.user1_id ? chatRoom.user2 : chatRoom.user1
    const lastMessage = chatRoom.messages && chatRoom.messages.length > 0 
      ? chatRoom.messages[chatRoom.messages.length - 1] 
      : null
    
    const unreadCount = chatRoom.messages ? 
      chatRoom.messages.filter(message => 
        message.sender_id !== user?.id && !message.is_read
      ).length : 0

    return {
      id: chatRoom.id,
      user_id: otherUser.id,
      house_id: chatRoom.item_id,
      user: {
        id: otherUser.id,
        full_name: otherUser.full_name || 'Unknown User',
        email: '',
        phone: ''
      },
      house: {
        id: chatRoom.item_id,
        title: `Property ${chatRoom.item_id.slice(0, 8)}...`
      },
      message: lastMessage?.content || 'No messages yet',
      status: unreadCount > 0 ? 'UNREAD' : 'PENDING',
      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt
    }
  }

  const displayInquiries = chatRooms.length > 0 
    ? chatRooms.map(convertChatRoomToInquiry)
    : (inquiries && inquiries.length > 0 ? inquiries : [])



  const handleOpenChat = async (inquiry: Inquiry) => {
    if (!user) {
      toast.error('Please log in to start a chat')
      return
    }

    setSelectedInquiry(inquiry)
    
    const existingChatRoom = chatRooms.find(room => room.id === inquiry.id)
    if (existingChatRoom) {
      setChatroomId(existingChatRoom.id)
      setIsChatModalOpen(true)
      return
    }

    if (!inquiry.user?.id) {
      toast.error('User information not available')
      return
    }

    setIsCreatingChat(true)
    
    try {
      const response = await chatService.createChatRoom({
        type: 'HOUSE',
        item_id: inquiry.house?.id || inquiry.id,
        target_user_id: inquiry.user.id
      })

      setChatroomId(response.chatRoom.id)
      setIsChatModalOpen(true)
      toast.success('Chat room opened successfully!')
    } catch (error) {
      console.error('Error creating chat room:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chat room'
      toast.error(errorMessage)
    } finally {
      setIsCreatingChat(false)
    }
  }

  const handleCloseChatModal = () => {
    setIsChatModalOpen(false)
    setSelectedInquiry(null)
    setChatroomId(null)
    
    const refreshChatRooms = async () => {
      if (!user) return
      
      try {
        const rooms = await chatService.getMyChatRooms()
        setChatRooms(rooms)
      } catch (error) {
        console.error('Error refreshing chat rooms:', error)
      }
    }
    
    refreshChatRooms()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <span className="bg-green-100 text-green-800">Accepted</span>
      case 'REJECTED':
        return <span className="bg-red-100 text-red-800">Rejected</span>
      case 'UNREAD':
        return <span className="bg-blue-100 text-blue-800 font-medium">Unread</span>
      case 'PENDING':
      default:
        return <span className="bg-yellow-100 text-yellow-800">Pending</span>
    }
  }

  const columns: DataDisplayColumn[] = [
    {
      key: 'user.full_name',
      label: 'Buyer',
      sortable: true,
      render: ( item) => (
        <div className="flex items-center gap-2">
          <div className="p-1 bg-blue-100 rounded-full">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500">{item.user1?.full_name || 'Unknown User'}</div>
          </div>
        </div>
      )
    },
    {
      key: 'house.title',
      label: 'Property',
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.house?.title || 'Unknown Property'}</div>
          <div className="text-sm text-gray-500">Property Inquiry</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      filterable: true,
      filterOptions: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'UNREAD', label: 'Unread' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'REJECTED', label: 'Rejected' },
      ],
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'createdAt',
      label: 'Inquired',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {new Date(item.createdAt).toLocaleDateString()}
        </div>
      )
    }
  ]

  const getActionsForInquiry = (inquiry: Inquiry): DataDisplayAction[] => {
    const actions: DataDisplayAction[] = [
      {
        key: 'chat',
        label: isCreatingChat && selectedInquiry?.id === inquiry.id ? 'Opening...' : 'Chat',
        icon: <MessageCircle className="h-4 w-4 cursor-pointer" />,
        onClick: () => handleOpenChat(inquiry),
        className: 'text-blue-600 cursor-pointer'
      }
    ]
    return actions
  }

  const handleRefreshChatRooms = async () => {
    if (!user) return
    setIsRefreshing(true)
    const rooms = await chatService.getMyChatRooms()
    setChatRooms(rooms)
    setIsRefreshing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inquiries</h1>
          <p className="text-gray-600">Review and manage property inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefreshChatRooms} variant="outline" size="sm" className="flex cursor-pointer items-center gap-2" disabled={isRefreshing}>
            <RefreshCcw className="h-4 w-4" />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <DataDisplay
        data={displayInquiries}
        columns={columns}
        actions={getActionsForInquiry}
        loading={isLoadingChatRooms || (loading && !inquiries) || isRefreshing}
        title="Property Inquiries"
        description="Manage inquiries and chat conversations from potential buyers"
        defaultView="table"
        emptyMessage="No chat conversations found. Chat conversations with potential buyers will appear here."
        searchPlaceholder="Search inquiries by buyer name, property, or status..."
        searchFields={['user.full_name', 'user.email', 'house.title', 'status']}   
        totalItems={displayInquiries.length}
        showFilters={true}
        itemsPerPage={5}
        onItemClick={() => {
        }}
      />

      <ChatModal
        isOpen={isChatModalOpen}
        onClose={handleCloseChatModal}
        chatroomId={chatroomId}
        houseTitle={selectedInquiry?.house?.title}
        ownerName={selectedInquiry?.user?.full_name}
      />
    </div>
  )
}
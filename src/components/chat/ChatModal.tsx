"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  X, 
  Send, 
  MessageCircle,
  User,
  Clock,
  Edit2,
  Check,
  X as XIcon
} from 'lucide-react'
import { chatService, ChatMessage } from '@/lib/api/chat-service'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  chatroomId: string | null
  houseTitle?: string
  ownerName?: string
}

export function ChatModal({ 
  isOpen, 
  onClose, 
  chatroomId, 
  houseTitle,
  ownerName 
}: ChatModalProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen && chatroomId) {
      loadMessages()
    }
  }, [isOpen, chatroomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    if (!chatroomId) return
    
    setIsLoading(true)
    try {
      const chatMessages = await chatService.getChatMessages(chatroomId)
      const sortedMessages = chatMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      setMessages(sortedMessages)
      
    } catch (error) {
      console.error('Error loading messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatroomId || isSending) return

    setIsSending(true)
    try {
      await chatService.sendMessage({
        chatroom_id: chatroomId,
        content: newMessage.trim()
      })

      setNewMessage('')
      
      await loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEditMessage = (message: ChatMessage) => {
    setEditingMessageId(message.id)
    setEditContent(message.content)
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditContent('')
  }

  const handleUpdateMessage = async () => {
    if (!editingMessageId || !editContent.trim() || isUpdating) return

    setIsUpdating(true)
    try {
      await chatService.updateMessage(editingMessageId, {
        content: editContent.trim()
      })

      setEditingMessageId(null)
      setEditContent('')
      
      await loadMessages()
      toast.success('Message updated successfully')
    } catch (error) {
      console.error('Error updating message:', error)
      toast.error('Failed to update message')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleUpdateMessage()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">Chat with {ownerName || 'Owner'}</h3>
                 
                </div>
                <p className="text-sm text-gray-600">{houseTitle}</p>
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const showDate = index === 0 || 
                  formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt)
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    )}
                    <div className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${message.sender_id === user?.id ? 'order-2' : 'order-1'}`}>
                        {editingMessageId === message.id ? (
                          <div className={`rounded-lg px-4 py-2 ${
                            message.sender_id === user?.id 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              onKeyDown={handleEditKeyPress}
                              placeholder="Edit your message..."
                              className={`w-full bg-transparent border-none outline-none resize-none text-sm ${
                                message.sender_id === user?.id ? 'text-white' : 'text-gray-900'
                              }`}
                              rows={Math.max(1, Math.ceil(editContent.length / 50))}
                              maxLength={500}
                              autoFocus
                            />
                            <div className="flex items-center justify-end mt-2 space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                className={`h-6 w-6 cursor-pointer p-0 ${
                                  message.sender_id === user?.id 
                                    ? 'text-white hover:bg-white/20' 
                                    : 'text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                <XIcon className="h-3 w-3 text-white" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleUpdateMessage}
                                disabled={isUpdating || !editContent.trim()}
                                className={`h-6 w-6 cursor-pointer p-0 ${
                                  message.sender_id === user?.id 
                                    ? 'text-white hover:bg-white/20' 
                                    : 'text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {isUpdating ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                ) : (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className={`rounded-lg px-4 py-2 relative ${
                            message.sender_id === user?.id 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="flex items-start justify-between">
                              <p className="text-sm flex-1 pr-2">{message.content}</p>
                              {message.sender_id === user?.id && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditMessage(message)}
                                  className={`h-6 w-6 p-0 flex-shrink-0 ${
                                    message.sender_id === user?.id 
                                      ? 'text-white/70 hover:text-white hover:bg-white/20' 
                                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                        <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}>
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(message.createdAt)}
                          {message.sender_id === user?.id && (
                            <span className={`ml-2 ${
                              message.is_read ? 'text-green-500' : 'text-gray-400'
                            }`}>
                              {message.is_read ? '✓ Read' : '✓ Sent'}
                            </span>
                          )}
                        
                        </div>
                      </div>
                      {message.sender_id !== user?.id && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 order-2">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isSending}
                maxLength={500}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                className="cursor-pointer"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {newMessage.length}/500 characters
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
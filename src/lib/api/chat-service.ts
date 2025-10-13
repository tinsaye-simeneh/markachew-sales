
export interface CreateChatRoomRequest {
  type: 'HOUSE' | 'JOB';
  item_id: string;
  target_user_id: string;
}

export interface CreateChatRoomResponse {
  chatRoom: {
    id: string;
    type: string;
    item_id: string;
    target_user_id: string;
    createdAt: string;
    updatedAt: string;
    is_active: boolean
    user1_id: string;
    user2_id: string;
  }
}

export interface SendMessageRequest {
  chatroom_id: string;
  content: string;
}

export interface SendMessageResponse {
  message_id: string;
  chatroom_id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export interface UpdateMessageRequest {
  content: string;
}

export interface UpdateMessageResponse {
  message_id: string;
  chatroom_id: string;
  content: string;
  sender_id: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  chatroom_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    full_name: string;
  };
}

export interface ChatRoom {
  id: string;
  type: string;
  item_id: string;
  user1_id: string;
  user2_id: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  user1: {
    id: string;
    full_name: string;
    user_type: string;
  };
  user2: {
    id: string;
    full_name: string;
    user_type: string;
  };
  messages: ChatMessage[];
}

export interface GetMessagesResponse {
  success: boolean;
  messages: ChatMessage[];
}

export interface GetMyChatRoomsResponse {
  success: boolean;
  chatRooms: ChatRoom[];
}

class ChatService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async createChatRoom(data: CreateChatRoomRequest): Promise<CreateChatRoomResponse> {
    const response = await fetch('/api/chats', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await fetch('/api/chats/message', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async updateMessage(messageId: string, data: UpdateMessageRequest): Promise<UpdateMessageResponse> {
    const response = await fetch(`/api/chats/${messageId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getChatRooms(): Promise<ChatRoom[]> {
    const response = await fetch('/api/chats', {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getMyChatRooms(): Promise<ChatRoom[]> {
    const response = await fetch('/api/chats/my', {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: GetMyChatRoomsResponse = await response.json();
    return data.chatRooms || [];
  }

  async getChatRoom(chatroomId: string): Promise<ChatRoom> {
    const response = await fetch(`/api/chats/${chatroomId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getChatMessages(chatroomId: string): Promise<ChatMessage[]> {
    const response = await fetch(`/api/chats/${chatroomId}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: GetMessagesResponse = await response.json();
    return data.messages || [];
  }
}

export const chatService = new ChatService();
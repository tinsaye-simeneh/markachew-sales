export const sampleInquiries = [
  {
    id: "1",
    user_id: "user1",
    house_id: "1",
    user: {
      id: "user1",
      full_name: "Alemayehu Tadesse",
      email: "alemu@example.com",
      phone: "+251 91 234 5678"
    },
    house: {
      id: "1",
      title: "Modern Villa in Bole"
    },
    message: "Hi! I'm very interested in this property. Could you tell me more about the neighborhood and if there are any additional fees?",
    status: "PENDING" as const,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    user_id: "user2",
    house_id: "2",
    user: {
      id: "user2",
      full_name: "Meron Getachew",
      email: "meron@example.com",
      phone: "+251 92 345 6789"
    },
    house: {
      id: "2",
      title: "Cozy Apartment in Kazanchis"
    },
    message: "Hello! I would like to schedule a viewing for this apartment. What are your available times this week?",
    status: "ACCEPTED" as const,
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T16:45:00Z"
  },
  {
    id: "3",
    user_id: "user3",
    house_id: "3",
    user: {
      id: "user3",
      full_name: "Yonas Assefa",
      email: "yonas@example.com",
      phone: "+251 93 456 7890"
    },
    house: {
      id: "3",
      title: "Luxury Condo in Cazanchis"
    },
    message: "Is this property still available? I'm looking for something in this price range with good amenities.",
    status: "PENDING" as const,
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z"
  },
  {
    id: "4",
    user_id: "user4",
    house_id: "4",
    user: {
      id: "user4",
      full_name: "Selamawit Bekele",
      email: "selam@example.com",
      phone: "+251 94 567 8901"
    },
    house: {
      id: "4",
      title: "Family House in Bole"
    },
    message: "This looks perfect for my family! Could you provide more details about the school district and nearby facilities?",
    status: "REJECTED" as const,
    createdAt: "2024-01-12T16:30:00Z",
    updatedAt: "2024-01-12T18:20:00Z"
  },
  {
    id: "5",
    user_id: "user5",
    house_id: "5",
    user: {
      id: "user5",
      full_name: "Dawit Haile",
      email: "dawit@example.com",
      phone: "+251 95 678 9012"
    },
    house: {
      id: "5",
      title: "Spacious Villa in Old Airport"
    },
    message: "I'm interested in this villa. What are the payment terms and is financing available?",
    status: "PENDING" as const,
    createdAt: "2024-01-11T11:45:00Z",
    updatedAt: "2024-01-11T11:45:00Z"
  },
  {
    id: "6",
    user_id: "user6",
    house_id: "6",
    user: {
      id: "user6",
      full_name: "Hirut Tesfaye",
      email: "hirut@example.com",
      phone: "+251 96 789 0123"
    },
    house: {
      id: "6",
      title: "Modern Apartment in Kazanchis"
    },
    message: "Hi! I love the modern design of this apartment. Is it pet-friendly and what are the parking arrangements?",
    status: "ACCEPTED" as const,
    createdAt: "2024-01-10T13:20:00Z",
    updatedAt: "2024-01-10T15:30:00Z"
  }
]

export const sampleChatMessages = [
  {
    id: "1",
    inquiryId: "1",
    sender: "buyer" as const,
    senderName: "Alemayehu Tadesse",
    message: "Hi! I'm very interested in this property. Could you tell me more about the neighborhood?",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: true
  },
  {
    id: "2",
    inquiryId: "1",
    sender: "seller" as const,
    senderName: "You",
    message: "Hello! Thank you for your interest. The neighborhood is very safe and family-friendly. There are several schools, shopping centers, and restaurants nearby. Would you like to schedule a viewing?",
    timestamp: "2024-01-15T10:45:00Z",
    isRead: true
  },
  {
    id: "3",
    inquiryId: "1",
    sender: "buyer" as const,
    senderName: "Alemayehu Tadesse",
    message: "That sounds great! What are your available times this week? I'm particularly interested in the weekend.",
    timestamp: "2024-01-15T11:00:00Z",
    isRead: true
  },
  {
    id: "4",
    inquiryId: "1",
    sender: "seller" as const,
    senderName: "You",
    message: "I have availability on Saturday from 10 AM to 4 PM and Sunday from 2 PM to 6 PM. Which works better for you?",
    timestamp: "2024-01-15T11:15:00Z",
    isRead: false
  },
  {
    id: "5",
    inquiryId: "2",
    sender: "buyer" as const,
    senderName: "Meron Getachew",
    message: "Hello! I would like to schedule a viewing for this apartment. What are your available times this week?",
    timestamp: "2024-01-14T14:20:00Z",
    isRead: true
  },
  {
    id: "6",
    inquiryId: "2",
    sender: "seller" as const,
    senderName: "You",
    message: "Hi Meron! I can show you the apartment on Tuesday at 2 PM or Wednesday at 10 AM. Which works for you?",
    timestamp: "2024-01-14T14:35:00Z",
    isRead: true
  },
  {
    id: "7",
    inquiryId: "2",
    sender: "buyer" as const,
    senderName: "Meron Getachew",
    message: "Tuesday at 2 PM works perfectly! I'll see you then. Thank you!",
    timestamp: "2024-01-14T14:50:00Z",
    isRead: true
  }
]


export const getInquiryById = (id: string) => {
  return sampleInquiries.find(inquiry => inquiry.id === id)
}

export const getChatMessagesByInquiryId = (inquiryId: string) => {
  return sampleChatMessages.filter(message => message.inquiryId === inquiryId)
}

export type Inquiry = typeof sampleInquiries[0]
export type ChatMessage = typeof sampleChatMessages[0]
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.chatroom_id || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: chatroom_id, content' },
        { status: 400 }
      )
    }

    // Validate content length
    if (body.content.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Message content cannot exceed 500 characters' },
        { status: 400 }
      )
    }

    // Get authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/chats/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json(data, { status: 201 })
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to send message' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
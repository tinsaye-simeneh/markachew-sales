import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.type || !body.item_id || !body.target_user_id) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: type, item_id, target_user_id' },
        { status: 400 }
      )
    }

    // Get authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/chats`, {
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
        { success: false, message: data.message || 'Failed to create chat room' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error creating chat room:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/chats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      }
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch chat rooms' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error fetching chat rooms:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
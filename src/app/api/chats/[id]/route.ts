import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Chat room ID is required' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    
    const response = await fetch(`${API_BASE_URL}/api/chats/${id}`, {
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
        { success: false, message: data.message || 'Failed to fetch chat room' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error fetching chat room:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Message ID is required' },
        { status: 400 }
      )
    }

    if (!body.content) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 }
      )
    }

    if (body.content.length > 500) {
      return NextResponse.json(
        { success: false, message: 'Message content cannot exceed 500 characters' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    
      const response = await fetch(`${API_BASE_URL}/api/chats/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader && { Authorization: authHeader })
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    if (response.ok) {
      return NextResponse.json(data, { status: 200 })
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update message' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
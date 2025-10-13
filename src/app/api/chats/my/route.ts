import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(request: NextRequest) {
  try {
    // Get authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    // Forward the request to the backend API
    const response = await fetch(`${API_BASE_URL}/api/chats/my`, {
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
        { success: false, message: data.message || 'Failed to fetch my chat rooms' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error fetching my chat rooms:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
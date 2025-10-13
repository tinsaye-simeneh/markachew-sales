import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://employee.luckbingogames.com'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      )
    }

    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/jobs/toggle/${jobId}`, {
      method: 'PUT',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to toggle job status' 
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Job status toggled successfully'
    })

  } catch (error) {
    console.error('Toggle job proxy error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
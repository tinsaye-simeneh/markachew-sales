import { NextRequest, NextResponse } from 'next/server'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payer_id, amount, receipt_image } = body

    if (!payer_id || !amount || !receipt_image) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: payer_id, amount, and receipt_image are required' 
        },
        { status: 400 }
      )
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Amount must be a positive number' 
        },
        { status: 400 }
      )
    }

    const authorization = request.headers.get('authorization')
    
    const backendResponse = await fetch(`${API_BASE_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization })
      },
      body: JSON.stringify({
        payer_id,
        amount,
        receipt_image
      })
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to create payment' 
        },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment created successfully',
      data: data.data
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
      const backendResponse = await fetch(`${API_BASE_URL}/api/payments${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization })
      }
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to fetch payments' 
        },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json({
      success: true,
      data: data.data
    })

  } catch (error) {
    console.error('Payment fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
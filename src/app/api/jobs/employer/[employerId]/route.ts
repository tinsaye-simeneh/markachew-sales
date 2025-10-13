import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ employerId: string }> }
) {
  try {
    const { employerId } = await params;
    
    if (!employerId) {
      return NextResponse.json(
        { success: false, message: 'Employer ID is required' },
        { status: 400 }
      );
    }
    
    const authHeader = request.headers.get('authorization');
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (authHeader) {
      headers.Authorization = authHeader;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/jobs/me`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Employer jobs proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

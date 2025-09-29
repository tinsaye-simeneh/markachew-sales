import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const response = await fetch(`${API_BASE_URL}/api/houses${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Houses proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const contentType = request.headers.get('content-type');
    
    if (contentType && contentType.startsWith('multipart/form-data')) {
      const formData = await request.formData();
      
      const response = await fetch(`${API_BASE_URL}/api/houses`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError: unknown) {
        console.error('Failed to parse response as JSON:', parseError);
        const textResponse = await response.text();
        console.error('Raw response:', textResponse);
        return NextResponse.json(
          { success: false, message: 'Invalid response from server', rawResponse: textResponse },
          { status: 500 }
        );
      }

      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } else {
      // Handle JSON requests
      let body;
      try {
        body = await request.json();
      } catch (parseError: unknown) {
        return NextResponse.json(
          { success: false, message: parseError instanceof Error ? parseError.message : 'Invalid request format' },
          { status: 400 }
        );
      }
      const response = await fetch(`${API_BASE_URL}/api/houses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(authHeader && { 'Authorization': authHeader }),
        },
        body: JSON.stringify(body),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError: unknown) {
        console.error('Failed to parse response as JSON:', parseError);
        const textResponse = await response.text();
        console.error('Raw response:', textResponse);
        return NextResponse.json(
          { success: false, message: 'Invalid response from server', rawResponse: textResponse },
          { status: 500 }
        );
      }

      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
  } catch (error) {
    console.error('Create house proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
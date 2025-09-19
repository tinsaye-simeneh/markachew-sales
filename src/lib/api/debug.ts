// Debug utility to test API connections
import { API_CONFIG } from './config';

export async function debugApiConnection() {
  console.log('🔍 Debugging API Connection...');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Base URL:', API_CONFIG.BASE_URL);
  console.log('Register endpoint:', API_CONFIG.ENDPOINTS.USERS.REGISTER);
  console.log('Login endpoint:', API_CONFIG.ENDPOINTS.USERS.LOGIN);
  
  // Test direct API call
  try {
    console.log('🌐 Testing direct API call...');
    const directResponse = await fetch('https://employee.luckbingogames.com/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0912345678',
        user_type: 'BUYER',
        password: 'password123'
      })
    });
    console.log('Direct API response status:', directResponse.status);
    console.log('Direct API response headers:', Object.fromEntries(directResponse.headers.entries()));
  } catch (error) {
    console.error('Direct API error:', error);
  }
  
  // Test proxy route
  try {
    console.log('🔄 Testing proxy route...');
    const proxyResponse = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: 'Test User',
        email: 'test@example.com',
        phone: '0912345678',
        user_type: 'BUYER',
        password: 'password123'
      })
    });
    console.log('Proxy response status:', proxyResponse.status);
    console.log('Proxy response headers:', Object.fromEntries(proxyResponse.headers.entries()));
  } catch (error) {
    console.error('Proxy route error:', error);
  }
}

// Call this function in your browser console to debug
if (typeof window !== 'undefined') {
  (window as Record<string, unknown>).debugApiConnection = debugApiConnection;
}
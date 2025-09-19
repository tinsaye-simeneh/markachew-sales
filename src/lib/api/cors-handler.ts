// CORS Error Handler
// This utility helps handle CORS errors and provides fallback options

export interface CorsError extends Error {
  name: 'CorsError';
  message: string;
}

export function isCorsError(error: unknown): error is CorsError {
  return (error as Record<string, unknown>)?.name === 'CorsError' || 
         String((error as Record<string, unknown>)?.message || '').includes('CORS') ||
         String((error as Record<string, unknown>)?.message || '').includes('cross-origin') ||
         String((error as Record<string, unknown>)?.message || '').includes('Access-Control-Allow-Origin');
}

export function handleCorsError(error: unknown): string {
  if (isCorsError(error)) {
    return 'CORS Error: The API server needs to allow requests from this domain. Please contact the administrator.';
  }
  return String((error as Record<string, unknown>)?.message || 'An unexpected error occurred');
}

// Alternative API client for CORS issues
export class CorsAwareApiClient {
  private baseURL: string;
  private useProxy: boolean;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://employee.luckbingogames.com';
    this.useProxy = process.env.NODE_ENV === 'development'; // Use proxy in development to avoid CORS
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.useProxy ? endpoint : `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (isCorsError(error)) {
        console.warn('CORS error detected, trying proxy route...');
        // Try with proxy route
        const proxyUrl = `/api/proxy${endpoint}`;
        const proxyResponse = await fetch(proxyUrl, options);
        
        if (!proxyResponse.ok) {
          throw new Error(`Proxy request failed: ${proxyResponse.status}`);
        }
        
        return await proxyResponse.json();
      }
      throw error;
    }
  }
}

export const corsAwareClient = new CorsAwareApiClient();
// Development Configuration for CORS Issues
// This file provides alternative configurations for development

export const DEV_CONFIG = {
  // Use localhost proxy in development
  USE_PROXY: process.env.NODE_ENV === 'development',
  
  // Alternative API endpoints for development
  PROXY_ENDPOINTS: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    JOBS: '/api/jobs',
    HOUSES: '/api/houses',
    CATEGORIES: '/api/categories',
  },
  
  // Direct API endpoints (for production)
  DIRECT_ENDPOINTS: {
    REGISTER: '/api/users/register',
    LOGIN: '/api/users/login',
    JOBS: '/api/jobs',
    HOUSES: '/api/houses',
    CATEGORIES: '/api/categories',
  },
  
  // Get the appropriate endpoint based on environment
  getEndpoint: (endpoint: string) => {
    if (DEV_CONFIG.USE_PROXY) {
      return DEV_CONFIG.PROXY_ENDPOINTS[endpoint as keyof typeof DEV_CONFIG.PROXY_ENDPOINTS] || endpoint;
    }
    return DEV_CONFIG.DIRECT_ENDPOINTS[endpoint as keyof typeof DEV_CONFIG.DIRECT_ENDPOINTS] || endpoint;
  }
};

// CORS-friendly fetch wrapper
export async function corsFriendlyFetch(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    return response;
  } catch (error) {
    // If CORS error, try with proxy
    if (error instanceof TypeError && error.message.includes('CORS')) {
      console.warn('CORS error detected, trying proxy route...');
      const proxyUrl = `/api/proxy${url.replace(/^https?:\/\/[^\/]+/, '')}`;
      return fetch(proxyUrl, { ...defaultOptions, ...options });
    }
    throw error;
  }
}
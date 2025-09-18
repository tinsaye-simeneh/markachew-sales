// API Connection Test
// This file can be used to test the API connection

import { apiClient } from './client';

export async function testApiConnection(): Promise<boolean> {
  try {
    // Test basic connectivity
    const response = await fetch('https://employee.luckbingogames.com');
    return response.ok;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}

export async function testApiEndpoints(): Promise<void> {
  try {
    console.log('Testing API endpoints...');
    
    // Test categories endpoint (public)
    const categoriesResponse = await apiClient.get('/api/categories');
    console.log('Categories endpoint:', categoriesResponse.success ? '✅ Working' : '❌ Failed');
    
    // Test jobs endpoint (public)
    const jobsResponse = await apiClient.get('/api/jobs');
    console.log('Jobs endpoint:', jobsResponse.success ? '✅ Working' : '❌ Failed');
    
    // Test houses endpoint (public)
    const housesResponse = await apiClient.get('/api/houses');
    console.log('Houses endpoint:', housesResponse.success ? '✅ Working' : '❌ Failed');
    
  } catch (error) {
    console.error('API endpoints test failed:', error);
  }
}

// Uncomment to run tests
// testApiConnection().then(result => console.log('API Connection:', result ? '✅ Connected' : '❌ Failed'));
// testApiEndpoints();
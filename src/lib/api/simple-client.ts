import { corsProxyService } from './cors-proxy';

export class SimpleApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = 'https://employee.luckbingogames.com';
  }

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      return await this.directPost<T>(url, data);
    } catch {
      console.warn('Direct request failed, trying alternative methods...');
      
      try {
        return await corsProxyService.requestWithProxy<T>(url, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (proxyError) {
        console.error('Proxy request also failed:', proxyError);
        
        try {
          return await this.postWithDifferentHeaders<T>(url, data);
        } catch (headerError) {
          console.error('All strategies failed:', headerError);
          throw new Error('Unable to connect to the API server. Please check your internet connection and try again.');
        }
      }
    }
  }

  private async directPost<T>(url: string, data: Record<string, unknown>): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  private async postWithDifferentHeaders<T>(url: string, data: Record<string, unknown>): Promise<T> {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (compatible; API-Client/1.0)',
      },
      body: JSON.stringify(data),
      mode: 'no-cors',
    });

    throw new Error('no-cors mode not suitable for this API');
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      return await this.directGet<T>(url);
    } catch {
      console.warn('Direct GET request failed, trying proxy...');
      return await corsProxyService.requestWithProxy<T>(url, {
        method: 'GET',
      });
    }
  }

  private async directGet<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export const simpleApiClient = new SimpleApiClient();
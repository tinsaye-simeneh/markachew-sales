// CORS Proxy Service
// This service provides multiple fallback options for CORS issues

export class CorsProxyService {
  private static instance: CorsProxyService;
  private proxyUrls: string[] = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/',
  ];
  private currentProxyIndex = 0;

  static getInstance(): CorsProxyService {
    if (!CorsProxyService.instance) {
      CorsProxyService.instance = new CorsProxyService();
    }
    return CorsProxyService.instance;
  }

  async requestWithProxy<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const proxyUrl = this.proxyUrls[this.currentProxyIndex];
    const proxiedUrl = `${proxyUrl}${encodeURIComponent(url)}`;

    try {
      console.log(`🔄 Trying proxy ${this.currentProxyIndex + 1}: ${proxyUrl}`);
      
      const response = await fetch(proxiedUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Proxy request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Proxy request successful');
      return data;
    } catch (error) {
      console.error(`❌ Proxy ${this.currentProxyIndex + 1} failed:`, error);
      
      // Try next proxy
      this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyUrls.length;
      
      if (this.currentProxyIndex === 0) {
        // All proxies failed
        throw new Error('All CORS proxy services failed. Please try again later.');
      }
      
      // Retry with next proxy
      return this.requestWithProxy(url, options);
    }
  }

  async directRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      console.log('🌐 Attempting direct request...');
      
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
        throw new Error(`Direct request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Direct request successful');
      return data;
    } catch (error) {
      console.error('❌ Direct request failed:', error);
      throw error;
    }
  }

  async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // First try direct request
      return await this.directRequest<T>(url, options);
    } catch (error) {
      console.warn('Direct request failed, trying proxy...');
      // If direct fails, try proxy
      return await this.requestWithProxy<T>(url, options);
    }
  }
}

export const corsProxyService = CorsProxyService.getInstance();
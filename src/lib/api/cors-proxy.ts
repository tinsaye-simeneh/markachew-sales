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
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      
      this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxyUrls.length;
      
      if (this.currentProxyIndex === 0) {
        throw new Error('All CORS proxy services failed. Please try again later.');
      }
      
      return this.requestWithProxy(url, options);
    }
  }

  async directRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
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
        throw new Error(`Direct request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      return await this.directRequest<T>(url, options);
    } catch {
      return await this.requestWithProxy<T>(url, options);
    }
  }
}

export const corsProxyService = CorsProxyService.getInstance();
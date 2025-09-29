import { API_CONFIG, ApiResponse } from './config';

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private isRefreshing: boolean = false;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Accept': 'application/json',
    };

    // Only set Content-Type if it's not already set (for FormData)
    // Check if Content-Type is explicitly set to empty object or not set at all
    const hasContentType = options.headers && 'Content-Type' in options.headers;
    if (!hasContentType) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        mode: 'cors',
        credentials: 'omit',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // if (response.status === 401 && !this.isRefreshing) {
        //   const refreshed = await this.handleTokenRefresh();
        //   if (refreshed) {
        //     const retryConfig = {
        //       ...config,
        //       headers: {
        //         ...config.headers,
        //         Authorization: `Bearer ${this.getToken()}`,
        //       },
        //     };
        //     const retryResponse = await fetch(url, {
        //       ...retryConfig,
        //       signal: controller.signal,
        //       mode: 'cors',
        //       credentials: 'omit',
        //     });
            
        //     if (retryResponse.ok) {
        //       const retryData = await retryResponse.json();
        //       return retryData;
        //     }
        //   }
        // }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
          console.error('CORS Error detected:', error.message);
          throw new Error('CORS Error: Unable to connect to the API server. Please check your network connection or contact support.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }


  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async handleTokenRefresh(): Promise<boolean> {
    if (this.isRefreshing) {
      return false;
    }

    this.isRefreshing = true;
    
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.isRefreshing = false;
        return false;
      }

      const response = await fetch(`${this.baseURL}/api/users/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        mode: 'cors',
        credentials: 'omit',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.accessToken) {
          this.setToken(data.data.accessToken);
          if (data.data.refreshToken) {
            this.setRefreshToken(data.data.refreshToken);
          }
          this.isRefreshing = false;
          return true;
        }
      }
      
      this.removeToken();
      this.isRefreshing = false;
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return false;
    } catch {
      this.removeToken();
      this.isRefreshing = false;
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return false;
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: Record<string, unknown> | FormData): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
  }

  async put<T>(endpoint: string, data?: Record<string, unknown> | FormData): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  setAuthToken(token: string): void {
    this.setToken(token);
  }

  clearAuthToken(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (!refreshToken) {
        return false;
      }

      const response = await this.post<{ accessToken: string; refreshToken: string }>(
        API_CONFIG.ENDPOINTS.USERS.REFRESH,
        { refreshToken }
      );

      if (response.success) {
        this.setToken(response.data.accessToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthToken();
      return false;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
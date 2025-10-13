import { apiClient } from './client';
import { simpleApiClient } from './simple-client';
import { API_CONFIG, LoginRequest, RegisterRequest, AuthResponse, User } from './config';
import { handleCorsError, isCorsError } from './cors-handler';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.USERS.LOGIN,
        credentials as unknown as Record<string, unknown>
      );
  
      if (response.success) {
        apiClient.setAuthToken(response.data.accessToken);
  
        if (typeof window !== 'undefined') {
          const encodeRole = (role: string) => {
            const rolePrefixes: Record<string, string> = {
              'EMPLOYER': 'ER',
              'EMPLOYEE': 'EE', 
              'SELLER': 'SL',
              'BUYER': 'BY',
              'ADMIN': 'AD',
              'SUPER_ADMIN': 'SA'
            };
            const prefix = rolePrefixes[role] || role.substring(0, 2);
            const scrambled = btoa(role.split('').reverse().join(''));
            return `${prefix}-${scrambled}`;
          };
  
          const user = response.data.user;
          const encodedUser = {
            ...user,
            user_type: encodeRole(user.user_type),
          };
  
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(encodedUser));
        }
      }
  
      return response.data;
    } catch (error) {
      if (isCorsError(error)) {
        throw new Error(handleCorsError(error));
      }
      throw error;
    }
  }
  

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const encodeRole = (role: string) => {
      const rolePrefixes: Record<string, string> = {
        'EMPLOYER': 'ER',
        'EMPLOYEE': 'EE', 
        'SELLER': 'SL',
        'BUYER': 'BY',
        'ADMIN': 'AD',
        'SUPER_ADMIN': 'SA'
      };
      const prefix = rolePrefixes[role] || role.substring(0, 2);
      const scrambled = btoa(role.split('').reverse().join(''));
      return `${prefix}-${scrambled}`;
    };
  
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.USERS.REGISTER,
        userData as unknown as Record<string, unknown>
      );
  
      if (response.success) {
        apiClient.setAuthToken(response.data.accessToken);
  
        if (typeof window !== 'undefined') {
          const user = response.data.user;
          const encodedUser = {
            ...user,
            user_type: encodeRole(user.user_type),
          };
  
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(encodedUser));
        }
      }
  
      return response.data;
    } catch (error) {
      try {
        const response = await simpleApiClient.post<AuthResponse>(
          API_CONFIG.ENDPOINTS.USERS.REGISTER,
          userData as unknown as Record<string, unknown>
        );
  
        if (response.success) {
          apiClient.setAuthToken(response.accessToken);
  
          if (typeof window !== 'undefined') {
            const user = response.user;
            const encodedUser = {
              ...user,
              user_type: encodeRole(user.user_type),
            };
  
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(encodedUser));
          }
        }
  
        return response;
      } catch (fallbackError) {
        if (isCorsError(error) || isCorsError(fallbackError)) {
          throw new Error(
            'CORS Error: Unable to register. Please try using a different browser or contact support.'
          );
        }
        throw new Error(
          'Registration failed. Please check your internet connection and try again.'
        );
      }
    }
  }
  

  async logout(): Promise<void> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (refreshToken) {
        await apiClient.post(API_CONFIG.ENDPOINTS.USERS.LOGOUT, { refreshToken } as unknown as Record<string, unknown>);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_CONFIG.ENDPOINTS.USERS.ME);
    return response.data;
  }

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined' && userStr !== 'null') {
        try {
          return JSON.parse(userStr);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.clear()
          return null;
        }
      }
    }
    return null;
  }

  clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  async refreshToken(): Promise<boolean> {
    return await apiClient.refreshToken();
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE(userId),
      userData
    );
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.USERS.DELETE(userId));
    apiClient.clearAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }
  }

  async getAllUsers(page = 1, limit = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      users: User[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(API_CONFIG.ENDPOINTS.USERS.LIST, { page, limit });
    return response.data;
  }
}

export class AdminAuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const encodeRole = (role: string) => {
      const rolePrefixes: Record<string, string> = {
        'EMPLOYER': 'ER',
        'EMPLOYEE': 'EE', 
        'SELLER': 'SL',
        'BUYER': 'BY',
        'ADMIN': 'AD',
        'SUPER_ADMIN': 'SA'
      };
      const prefix = rolePrefixes[role] || role.substring(0, 2);
      const scrambled = btoa(role.split('').reverse().join(''));
      return `${prefix}-${scrambled}`;
    };
  
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: {
          accessToken: string;
          refreshToken: string;
          expiresIn: string;
        };
        timestamp: string;
      }>(
        API_CONFIG.ENDPOINTS.ADMIN.LOGIN,
        credentials as unknown as Record<string, unknown>
      );
  
      if (response.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accessToken = (response as any).data.accessToken;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const refreshToken = (response as any).data.refreshToken;
  
        apiClient.setAuthToken(accessToken);
  
        if (typeof window !== 'undefined') {
          const adminUser = {
            id: 'admin',
            full_name: 'Admin User',
            email: credentials.email,
            phone: '',
            user_type: encodeRole('ADMIN'),
            createdAt: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
  
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('user', JSON.stringify(adminUser));
        }
  
        return {
          accessToken,
          refreshToken,
          user: {
            id: 'admin',
            full_name: 'Admin User',
            email: credentials.email,
            phone: '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            user_type: 'ADMIN' as any,
            createdAt: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          success: response.success,
        };
      }
  
      throw new Error('Admin login failed.');
    } catch (error) {
      throw error;
    }
  }
  

  async createAdmin(adminData: {
    email: string;
    password: string;
    role: 'ADMIN';
  }): Promise<User> {
    const response = await apiClient.post<User>(
      API_CONFIG.ENDPOINTS.ADMIN.CREATE,
      adminData as unknown as Record<string, unknown>
    );
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (refreshToken) {
        await apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.LOGOUT, { refreshToken } as unknown as Record<string, unknown>);
      }
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      apiClient.clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (!refreshToken) {
        return false;
      }

      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: {
          accessToken: string;
          refreshToken: string;
          expiresIn: string;
        };
        timestamp: string;
      }>(
        API_CONFIG.ENDPOINTS.ADMIN.REFRESH,
        { refreshToken } as unknown as Record<string, unknown>
      );

      if (response.success) {
        apiClient.setAuthToken(response.data.data.accessToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Admin token refresh failed:', error);
      this.logout();
      return false;
    }
  }

  isAdmin(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  }
}

export const authService = new AuthService();
export const adminAuthService = new AdminAuthService();
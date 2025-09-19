import { apiClient } from './client';
import { simpleApiClient } from './simple-client';
import { API_CONFIG, LoginRequest, RegisterRequest, AuthResponse, User } from './config';
import { handleCorsError, isCorsError } from './cors-handler';

export class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.USERS.LOGIN,
        credentials
      );

      if (response.success) {
        // Store tokens
        apiClient.setAuthToken(response.data.accessToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
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

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // First try with the main API client
      const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.USERS.REGISTER,
        userData
      );

      if (response.success) {
        // Store tokens
        apiClient.setAuthToken(response.data.accessToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return response.data;
    } catch (error) {
      console.warn('Main API client failed, trying simple client...', error);
      
      try {
        // Fallback to simple client with CORS proxy
        const response = await simpleApiClient.post<AuthResponse>(
          API_CONFIG.ENDPOINTS.USERS.REGISTER,
          userData
        );

        if (response.success) {
          // Store tokens
          apiClient.setAuthToken(response.accessToken);
          if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }

        return response;
      } catch (fallbackError) {
        console.error('All registration methods failed:', fallbackError);
        if (isCorsError(error) || isCorsError(fallbackError)) {
          throw new Error('CORS Error: Unable to register. Please try using a different browser or contact support.');
        }
        throw new Error('Registration failed. Please check your internet connection and try again.');
      }
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (refreshToken) {
        await apiClient.post(API_CONFIG.ENDPOINTS.USERS.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user data regardless of API call success
      apiClient.clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_CONFIG.ENDPOINTS.USERS.ME);
    return response.data;
  }

  // Get stored user
  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    return await apiClient.refreshToken();
  }

  // Update user profile
  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE(userId),
      userData
    );
    return response.data;
  }

  // Delete user account
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.USERS.DELETE(userId));
    // Clear auth data after successful deletion
    apiClient.clearAuthToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  // Get all users (admin only)
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

// Admin authentication methods
export class AdminAuthService {
  // Admin login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.ADMIN.LOGIN,
      credentials
    );

    if (response.success) {
      // Store tokens
      apiClient.setAuthToken(response.data.accessToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('isAdmin', 'true');
      }
    }

    return response.data;
  }

  // Create admin user (super admin only)
  async createAdmin(adminData: {
    email: string;
    password: string;
    role: 'ADMIN';
  }): Promise<User> {
    const response = await apiClient.post<User>(
      API_CONFIG.ENDPOINTS.ADMIN.CREATE,
      adminData
    );
    return response.data;
  }

  // Admin logout
  async logout(): Promise<void> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (refreshToken) {
        await apiClient.post(API_CONFIG.ENDPOINTS.ADMIN.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      // Clear tokens and user data
      apiClient.clearAuthToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
      }
    }
  }

  // Refresh admin token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem('refreshToken') 
        : null;
      
      if (!refreshToken) {
        return false;
      }

      const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        API_CONFIG.ENDPOINTS.ADMIN.REFRESH,
        { refreshToken }
      );

      if (response.success) {
        apiClient.setAuthToken(response.data.accessToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', response.data.refreshToken);
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

  // Check if user is admin
  isAdmin(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  }
}

// Create singleton instances
export const authService = new AuthService();
export const adminAuthService = new AdminAuthService();
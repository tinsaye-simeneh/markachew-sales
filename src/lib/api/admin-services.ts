import { apiClient } from './client';
import { API_CONFIG } from './config';
import type { User, Job, House, Application, UserType } from './config';

// Admin Dashboard Stats
export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalHouses: number;
  totalApplications: number;
  recentUsers: number;
  recentJobs: number;
  recentHouses: number;
  recentApplications: number;
  activeUsers: number;
  pendingApprovals: number;
}

// Admin User Management
export interface AdminUser extends User {
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  last_login?: string;
  profile_completed: boolean;
  verification_status: 'verified' | 'pending' | 'rejected';
}

export interface AdminUserFilters {
  user_type?: UserType;
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  verification_status?: 'verified' | 'pending' | 'rejected';
  search?: string;
  page?: number;
  limit?: number;
}

// Admin Job Management
export interface AdminJob extends Job {
  status: 'active' | 'inactive' | 'pending' | 'expired';
  applications_count?: number;
  views_count?: number;
  employer_name?: string;
  employer?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface AdminJobFilters {
  status?: 'active' | 'inactive' | 'pending' | 'expired';
  user_type?: UserType;
  search?: string;
  page?: number;
  limit?: number;
}

// Admin House Management
export interface AdminHouse extends House {
  status: 'active' | 'inactive' | 'pending' | 'sold';
  views_count?: number;
  seller_name?: string;
  owner?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface AdminHouseFilters {
  status?: 'active' | 'inactive' | 'pending' | 'sold';
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Admin Application Management
export interface AdminApplication extends Application {
  job_title: string;
  applicant_name: string;
  employer_name: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface AdminApplicationFilters {
  status?: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  job_id?: string;
  user_id?: string;
  page?: number;
  limit?: number;
}

// Admin Activity Log
export interface AdminActivity {
  id: string;
  type: 'user_registration' | 'job_posted' | 'house_listed' | 'application_submitted' | 'user_verification' | 'system_event';
  message: string;
  user_id?: string;
  user_name?: string;
  timestamp: string;
  status: 'success' | 'warning' | 'info' | 'error';
  metadata?: any;
}

// Admin Service Class
export class AdminService {
  // Dashboard Stats
  async getDashboardStats(): Promise<AdminStats> {
    try {
      // For now, we'll aggregate data from existing endpoints
      // In a real implementation, you'd have a dedicated admin stats endpoint
      const [usersResponse, jobsResponse, housesResponse, applicationsResponse] = await Promise.all([
        this.getAllUsers({ limit: 1 }),
        this.getAllJobs({ limit: 1 }),
        this.getAllHouses({ limit: 1 }),
        this.getAllApplications({ limit: 1 })
      ]);

      return {
        totalUsers: usersResponse.total,
        totalJobs: jobsResponse.total,
        totalHouses: housesResponse.total,
        totalApplications: applicationsResponse.total,
        recentUsers: Math.floor(usersResponse.total * 0.05), // Mock 5% recent
        recentJobs: Math.floor(jobsResponse.total * 0.1), // Mock 10% recent
        recentHouses: Math.floor(housesResponse.total * 0.08), // Mock 8% recent
        recentApplications: Math.floor(applicationsResponse.total * 0.15), // Mock 15% recent
        activeUsers: Math.floor(usersResponse.total * 0.85), // Mock 85% active
        pendingApprovals: Math.floor(usersResponse.total * 0.02), // Mock 2% pending
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return mock data as fallback
      return {
        totalUsers: 1248,
        totalJobs: 89,
        totalHouses: 156,
        totalApplications: 342,
        recentUsers: 23,
        recentJobs: 5,
        recentHouses: 8,
        recentApplications: 17,
        activeUsers: 1060,
        pendingApprovals: 25,
      };
    }
  }

  // User Management
  async getAllUsers(filters: AdminUserFilters = {}): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          users: AdminUser[];
          meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
          };
        };
        timestamp: string;
      }>(API_CONFIG.ENDPOINTS.USERS.LIST, filters);

      return {
        users: response.data.data.users || [],
        total: response.data.data.meta.totalItems,
        page: response.data.data.meta.currentPage,
        limit: response.data.data.meta.perPage,
        totalPages: response.data.data.meta.totalPages,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(API_CONFIG.ENDPOINTS.USERS.UPDATE(userId));
    return response.data;
  }

  async updateUser(userId: string, userData: Partial<AdminUser>): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE(userId),
      userData
    );
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.USERS.DELETE(userId));
  }

  async suspendUser(userId: string, reason: string): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE(userId),
      { status: 'suspended', suspension_reason: reason }
    );
    return response.data;
  }

  async activateUser(userId: string): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE(userId),
      { status: 'active' }
    );
    return response.data;
  }

  // Job Management
  async getAllJobs(filters: AdminJobFilters = {}): Promise<{
    jobs: AdminJob[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          jobs: AdminJob[];
          meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
          };
        };
        timestamp: string;
      }>(API_CONFIG.ENDPOINTS.JOBS.LIST, filters);

      return {
        jobs: response.data.data.jobs || [],
        total: response.data.data.meta.totalItems,
        page: response.data.data.meta.currentPage,
        limit: response.data.data.meta.perPage,
        totalPages: response.data.data.meta.totalPages,
      };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  async getJob(jobId: string): Promise<AdminJob> {
    const response = await apiClient.get<AdminJob>(API_CONFIG.ENDPOINTS.JOBS.GET(jobId));
    return response.data;
  }

  async updateJob(jobId: string, jobData: Partial<AdminJob>): Promise<AdminJob> {
    const response = await apiClient.put<AdminJob>(
      API_CONFIG.ENDPOINTS.JOBS.UPDATE(jobId),
      jobData
    );
    return response.data;
  }

  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.JOBS.DELETE(jobId));
  }

  async approveJob(jobId: string): Promise<AdminJob> {
    const response = await apiClient.put<AdminJob>(
      API_CONFIG.ENDPOINTS.JOBS.UPDATE(jobId),
      { status: 'active' }
    );
    return response.data;
  }

  async rejectJob(jobId: string, reason: string): Promise<AdminJob> {
    const response = await apiClient.put<AdminJob>(
      API_CONFIG.ENDPOINTS.JOBS.UPDATE(jobId),
      { status: 'inactive', rejection_reason: reason }
    );
    return response.data;
  }

  // House Management
  async getAllHouses(filters: AdminHouseFilters = {}): Promise<{
    houses: AdminHouse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          houses: AdminHouse[];
          meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
          };
        };
        timestamp: string;
      }>(API_CONFIG.ENDPOINTS.HOUSES.LIST, filters);

      return {
        houses: response.data.data.houses || [],
        total: response.data.data.meta.totalItems,
        page: response.data.data.meta.currentPage,
        limit: response.data.data.meta.perPage,
        totalPages: response.data.data.meta.totalPages,
      };
    } catch (error) {
      console.error('Error fetching houses:', error);
      throw error;
    }
  }

  async getHouse(houseId: string): Promise<AdminHouse> {
    const response = await apiClient.get<AdminHouse>(API_CONFIG.ENDPOINTS.HOUSES.GET(houseId));
    return response.data;
  }

  async updateHouse(houseId: string, houseData: Partial<AdminHouse>): Promise<AdminHouse> {
    const response = await apiClient.put<AdminHouse>(
      API_CONFIG.ENDPOINTS.HOUSES.UPDATE(houseId),
      houseData
    );
    return response.data;
  }

  async deleteHouse(houseId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.HOUSES.DELETE(houseId));
  }

  async approveHouse(houseId: string): Promise<AdminHouse> {
    const response = await apiClient.put<AdminHouse>(
      API_CONFIG.ENDPOINTS.HOUSES.UPDATE(houseId),
      { status: 'active' }
    );
    return response.data;
  }

  async rejectHouse(houseId: string, reason: string): Promise<AdminHouse> {
    const response = await apiClient.put<AdminHouse>(
      API_CONFIG.ENDPOINTS.HOUSES.UPDATE(houseId),
      { status: 'inactive', rejection_reason: reason }
    );
    return response.data;
  }

  // Application Management
  async getAllApplications(filters: AdminApplicationFilters = {}): Promise<{
    applications: AdminApplication[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: {
          applications: AdminApplication[];
          meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
          };
        };
        timestamp: string;
      }>(API_CONFIG.ENDPOINTS.APPLICATIONS.LIST, filters);

      return {
        applications: response.data.data.applications || [],
        total: response.data.data.meta.totalItems,
        page: response.data.data.meta.currentPage,
        limit: response.data.data.meta.perPage,
        totalPages: response.data.data.meta.totalPages,
      };
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async getApplication(applicationId: string): Promise<AdminApplication> {
    const response = await apiClient.get<AdminApplication>(
      API_CONFIG.ENDPOINTS.APPLICATIONS.GET(applicationId)
    );
    return response.data;
  }

  async updateApplication(applicationId: string, applicationData: Partial<AdminApplication>): Promise<AdminApplication> {
    const response = await apiClient.put<AdminApplication>(
      API_CONFIG.ENDPOINTS.APPLICATIONS.UPDATE(applicationId),
      applicationData
    );
    return response.data;
  }

  async deleteApplication(applicationId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.APPLICATIONS.DELETE(applicationId));
  }

  // Activity Log
  async getActivityLog(params: {
    type?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    activities: AdminActivity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      // This would typically be a dedicated admin endpoint
      // For now, we'll return mock data
      const mockActivities: AdminActivity[] = [
        {
          id: '1',
          type: 'user_registration',
          message: 'New user registered: John Doe',
          user_id: 'user_1',
          user_name: 'John Doe',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          status: 'success'
        },
        {
          id: '2',
          type: 'job_posted',
          message: 'New job posted: Software Engineer',
          user_id: 'user_2',
          user_name: 'Jane Smith',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          status: 'info'
        },
        {
          id: '3',
          type: 'house_listed',
          message: 'New house listed in Downtown',
          user_id: 'user_3',
          user_name: 'Bob Wilson',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'info'
        },
        {
          id: '4',
          type: 'application_submitted',
          message: 'Application submitted for Marketing Manager',
          user_id: 'user_4',
          user_name: 'Alice Johnson',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'warning'
        },
        {
          id: '5',
          type: 'user_verification',
          message: 'User verification pending: Jane Smith',
          user_id: 'user_2',
          user_name: 'Jane Smith',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          status: 'warning'
        }
      ];

      return {
        activities: mockActivities,
        total: mockActivities.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
    } catch (error) {
      console.error('Error fetching activity log:', error);
      throw error;
    }
  }

  // System Management
  async getSystemStatus(): Promise<{
    api_status: 'operational' | 'degraded' | 'down';
    database_status: 'healthy' | 'degraded' | 'down';
    storage_usage: number;
    active_connections: number;
    last_backup: string;
  }> {
    try {
      // This would typically be a dedicated system status endpoint
      // For now, we'll return mock data
      return {
        api_status: 'operational',
        database_status: 'healthy',
        storage_usage: 78,
        active_connections: 1247,
        last_backup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      };
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const adminService = new AdminService();
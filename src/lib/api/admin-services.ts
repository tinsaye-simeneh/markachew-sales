import { apiClient } from './client';
import { API_CONFIG } from './config';
import type { User, Job, House, Application, UserType, JobStatus, HouseStatus, ApplicationStatus } from './config';

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalHouses: number;
}

export interface AdminUser extends User {
  status: boolean;
  last_login?: string;
  profile_completed: boolean;
  verification_status: 'verified' | 'pending' | 'rejected';
}

export interface AdminUserFilters {
  user_type?: UserType;
  status?: boolean;
  verification_status?: 'verified' | 'pending' | 'rejected';
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminJob extends Job {
  status: JobStatus;
  applications_count?: number;
  views_count?: number;
  employer_name?: string;
}

export interface AdminJobFilters {
  status?: 'active' | 'inactive' | 'pending' | 'expired';
  user_type?: UserType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminHouse extends House {
  status: HouseStatus;
  views_count?: number;
  seller_name?: string;
}

export interface AdminHouseFilters {
  status?: HouseStatus;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminApplication extends Application {
  job_title: string;
  applicant_name: string;
  employer_name: string;
}

export interface AdminApplicationFilters {
  status?: ApplicationStatus;
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
  metadata?: Record<string, unknown>;
}

export class AdminService {
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const [users, jobs, houses] = await Promise.allSettled([
        this.getAllUsers(),
        this.getAllJobs(),
        this.getAllHouses(),
      ]);
      
      return {
        totalUsers: users.status === 'fulfilled' ? users.value.total : 0,
        totalJobs: jobs.status === 'fulfilled' ? jobs.value.total : 0,
        totalHouses: houses.status === 'fulfilled' ? houses.value.total : 0,
      };
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        totalUsers: 0,
        totalJobs: 0,
        totalHouses: 0,
      };
    }
  }

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
        users: AdminUser[];
        meta: {
          currentPage: number;
          perPage: number;
          totalItems: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
        timestamp: string;
      }>(API_CONFIG.ENDPOINTS.USERS.LIST, filters as unknown as Record<string, unknown>);

      return {
        users: response.data.users || [],
        total: response.data.meta.totalItems,
        page: response.data.meta.currentPage,
        limit: response.data.meta.perPage,
        totalPages: response.data.meta.totalPages,
      };
      
    } catch (error) {
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
        jobs: AdminJob[];
        meta: {
          currentPage: number;
          perPage: number;
          totalItems: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
        timestamp: string;
      }>(API_CONFIG.ENDPOINTS.JOBS.LIST, filters as unknown as Record<string, unknown>);


      return {
        jobs: response.data.jobs || [],
        total: response.data.meta.totalItems,
        page: response.data.meta.currentPage,
        limit: response.data.meta.perPage,
        totalPages: response.data.meta.totalPages,
      };
    } catch (error) {
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
      { status: 'ACTIVE' }
    );
    return response.data;
  }

  async rejectJob(jobId: string, reason: string): Promise<AdminJob> {
    const response = await apiClient.put<AdminJob>(
      API_CONFIG.ENDPOINTS.JOBS.UPDATE(jobId),
      { status: 'INACTIVE', rejection_reason: reason }
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
        houses: AdminHouse[];
        meta: {
          currentPage: number;
          perPage: number;
          totalItems: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
        timestamp: string;
      }>(API_CONFIG.ENDPOINTS.HOUSES.LIST, filters as unknown as Record<string, unknown>);

      return {
        houses: response.data.houses || [],
        total: response.data.meta.totalItems,
        page: response.data.meta.currentPage,
        limit: response.data.meta.perPage,
        totalPages: response.data.meta.totalPages,
      };
      
    } catch (error) {
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
        applications: AdminApplication[];
        meta: {
          currentPage: number;
          perPage: number;
          totalItems: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
        timestamp: string;
      }>(API_CONFIG.ENDPOINTS.APPLICATIONS.LIST, filters as unknown as Record<string, unknown>);

      return {
        applications: response.data.applications || [],
        total: response.data.meta.totalItems,
        page: response.data.meta.currentPage,
        limit: response.data.meta.perPage,
        totalPages: response.data.meta.totalPages,
      };
      
    } catch (error) {
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
  async getActivityLog(): Promise<{
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
      throw error;
    }
  }

  async getSystemStatus(): Promise<{
    api_status: 'operational' | 'degraded' | 'down';
    database_status: 'healthy' | 'degraded' | 'down';
    storage_usage: number;
    active_connections: number;
    last_backup: string;
  }> {
    try {
    return {
        api_status: 'operational',
        database_status: 'healthy',
        storage_usage: 78,
        active_connections: 1247,
        last_backup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();
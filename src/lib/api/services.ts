import { apiClient } from './client';
import { API_CONFIG } from './config';
import type {
  Job,
  CreateJobRequest,
  House,
  CreateHouseRequest,
  Application,
  CreateApplicationRequest,
  Category,
  Profile,
  CreateProfileRequest,
} from './config';

export class JobsService {
  async createJob(jobData: CreateJobRequest): Promise<Job> {
    const formData = new FormData();
    formData.append('title', jobData.title);
    formData.append('description', jobData.description);
    formData.append('requirements', JSON.stringify(jobData.requirements));
    formData.append('responsibility', JSON.stringify(jobData.responsibility));
    
    if (jobData.link) {
      formData.append('link', jobData.link);
    }
    
    if (jobData.image) {
      formData.append('image', jobData.image);
    }

    const response = await apiClient.post<Job>(API_CONFIG.ENDPOINTS.JOBS.CREATE, formData);
    return response.data;
  }

  async getAllJobs(page = 1, limit = 10): Promise<{
    jobs: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      jobs: Job[];
      meta: {
        currentPage: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(
      API_CONFIG.ENDPOINTS.JOBS.LIST, 
      { page, limit }
    );
    
    return {
      jobs: response.data.jobs || [],
      total: response.data.meta.totalItems,
      page: response.data.meta.currentPage,
      limit: response.data.meta.perPage,
      totalPages: response.data.meta.totalPages,
    };
  }

  async getJob(jobId: string): Promise<Job> {
    const response = await apiClient.get<Job>(API_CONFIG.ENDPOINTS.JOBS.GET(jobId));
    return response.data;
  }

  async updateJob(jobId: string, jobData: Partial<CreateJobRequest>): Promise<Job> {
    const response = await apiClient.put<Job>(
      API_CONFIG.ENDPOINTS.JOBS.UPDATE(jobId),
      jobData
    );
    return response.data;
  }

  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.JOBS.DELETE(jobId));
  }
}

export class HousesService {
  async createHouse(houseData: CreateHouseRequest): Promise<House> {
    const formData = new FormData();
    formData.append('title', houseData.title);
    formData.append('type', houseData.type);
    formData.append('price', houseData.price.toString());
    formData.append('location', houseData.location);
    formData.append('category_id', houseData.category_id);
    
    if (houseData.images) {
      houseData.images.forEach((image) => {
        formData.append('image', image);
      });
    }
    
    if (houseData.video) {
      formData.append('video', houseData.video);
    }

    const response = await apiClient.post<House>(API_CONFIG.ENDPOINTS.HOUSES.CREATE, formData);
    return response.data;
  }

  async getAllHouses(page = 1, limit = 10): Promise<{
    houses: House[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      houses: House[];
      meta: {
        currentPage: number;
        perPage: number;
        totalItems: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(API_CONFIG.ENDPOINTS.HOUSES.LIST, { page, limit });
    
    return {
      houses: response.data.houses || [],
      total: response.data.meta.totalItems,
      page: response.data.meta.currentPage,
      limit: response.data.meta.perPage,
      totalPages: response.data.meta.totalPages,
    };
  }

  async getHouse(houseId: string): Promise<House> {
    const response = await apiClient.get<House>(API_CONFIG.ENDPOINTS.HOUSES.GET(houseId));
    return response.data;
  }

  async updateHouse(houseId: string, houseData: Partial<CreateHouseRequest>): Promise<House> {
    const response = await apiClient.put<House>(
      API_CONFIG.ENDPOINTS.HOUSES.UPDATE(houseId),
      houseData
    );
    return response.data;
  }

  async deleteHouse(houseId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.HOUSES.DELETE(houseId));
  }
}

export class ApplicationsService {
  async createApplication(applicationData: CreateApplicationRequest): Promise<Application> {
    const response = await apiClient.post<Application>(
      API_CONFIG.ENDPOINTS.APPLICATIONS.CREATE,
      applicationData as unknown as Record<string, unknown>
    );
    return response.data;
  }

  async getAllApplications(params?: {
    user_id?: string;
    job_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    applications: Application[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      applications: Application[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(API_CONFIG.ENDPOINTS.APPLICATIONS.LIST, params);
    return response.data;
  }

  async getApplication(applicationId: string): Promise<Application> {
    const response = await apiClient.get<Application>(
      API_CONFIG.ENDPOINTS.APPLICATIONS.GET(applicationId)
    );
    return response.data;
  }

  async updateApplication(
    applicationId: string,
    applicationData: Partial<CreateApplicationRequest>
  ): Promise<Application> {
    const response = await apiClient.put<Application>(
      API_CONFIG.ENDPOINTS.APPLICATIONS.UPDATE(applicationId),
      applicationData
    );
    return response.data;
  }

  async deleteApplication(applicationId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.APPLICATIONS.DELETE(applicationId));
  }

  async restoreApplication(applicationId: string): Promise<Application> {
    const response = await apiClient.put<Application>(
      API_CONFIG.ENDPOINTS.APPLICATIONS.RESTORE(applicationId)
    );
    return response.data;
  }
}

export class CategoriesService {
  async createCategory(categoryData: { name: string }): Promise<Category> {
    const response = await apiClient.post<Category>(
      API_CONFIG.ENDPOINTS.CATEGORIES.CREATE,
      categoryData as unknown as Record<string, unknown>
    );
    return response.data;
  }

  async getAllCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(API_CONFIG.ENDPOINTS.CATEGORIES.LIST);
    return response.data;
  }

  async getCategory(categoryId: string): Promise<Category> {
    const response = await apiClient.get<Category>(
      API_CONFIG.ENDPOINTS.CATEGORIES.GET(categoryId)
    );
    return response.data;
  }

  async updateCategory(categoryId: string, categoryData: { name: string }): Promise<Category> {
    const response = await apiClient.put<Category>(
      API_CONFIG.ENDPOINTS.CATEGORIES.UPDATE(categoryId),
      categoryData
    );
    return response.data;
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.CATEGORIES.DELETE(categoryId));
  }
}

export class ProfilesService {
  async getCurrentUserProfile(): Promise<Profile> {
    const response = await apiClient.get<Profile>(API_CONFIG.ENDPOINTS.USERS.ME);
    return response.data;
  }

  async createProfile(profileData: CreateProfileRequest): Promise<Profile> {
    const formData = new FormData();
    formData.append('user_id', profileData.user_id);
    formData.append('location', profileData.location);
    formData.append('address', profileData.address);
    
    if (profileData.photo) {
      formData.append('photo', profileData.photo);
    }
    
    if (profileData.document) {
      formData.append('document', profileData.document);
    }
    
    if (profileData.license) {
      formData.append('license', profileData.license);
    }
    
    if (profileData.degree) {
      formData.append('degree', profileData.degree);
    }
    
    if (profileData.department) {
      formData.append('department', profileData.department);
    }
    
    if (profileData.experience) {
      formData.append('experience', profileData.experience.toString());
    }
    
    if (profileData.availability) {
      formData.append('availability', profileData.availability);
    }
    
    if (profileData.salary_expectation) {
      formData.append('salary_expectation', profileData.salary_expectation.toString());
    }

    const response = await apiClient.post<Profile>(API_CONFIG.ENDPOINTS.PROFILES.CREATE, formData);
    return response.data;
  }

  async getProfile(userId: string): Promise<Profile> {
    const response = await apiClient.get<Profile>(
      API_CONFIG.ENDPOINTS.PROFILES.GET(userId)
    );
    return response.data;
  }

  async updateProfile(userId: string, profileData: Partial<CreateProfileRequest>): Promise<Profile> {
    const formData = new FormData();
    
    if (profileData.location) {
      formData.append('location', profileData.location);
    }
    
    if (profileData.address) {
      formData.append('address', profileData.address);
    }
    
    if (profileData.photo) {
      formData.append('photo', profileData.photo);
    }
    
    if (profileData.document) {
      formData.append('document', profileData.document);
    }
    
    if (profileData.license) {
      formData.append('license', profileData.license);
    }
    
    if (profileData.degree) {
      formData.append('degree', profileData.degree);
    }
    
    if (profileData.department) {
      formData.append('department', profileData.department);
    }
    
    if (profileData.experience) {
      formData.append('experience', profileData.experience.toString());
    }
    
    if (profileData.availability) {
      formData.append('availability', profileData.availability);
    }
    
    if (profileData.salary_expectation) {
      formData.append('salary_expectation', profileData.salary_expectation.toString());
    }

    const response = await apiClient.put<Profile>(
      API_CONFIG.ENDPOINTS.PROFILES.UPDATE(userId),
      formData
    );
    return response.data;
  }

  async deleteProfile(userId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PROFILES.DELETE(userId));
  }
}

export class PaymentsService {
  async createPayment(paymentData: {
    recipient_id: string;
    start_date: string;
    end_date: string;
  }): Promise<unknown> {
    const response = await apiClient.post<unknown>(
      API_CONFIG.ENDPOINTS.PAYMENTS.CREATE,
      paymentData
    );
    return response.data;
  }

  async getAllPayments(params?: {
    mine?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{
    payments: unknown[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      payments: unknown[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(API_CONFIG.ENDPOINTS.PAYMENTS.LIST, params);
    return response.data;
  }

  async getPayment(paymentId: string): Promise<unknown> {
    const response = await apiClient.get<unknown>(
      API_CONFIG.ENDPOINTS.PAYMENTS.GET(paymentId)
    );
    return response.data;
  }

  async updatePayment(paymentId: string, paymentData: { status: string }): Promise<unknown> {
    const response = await apiClient.put<unknown>(
      API_CONFIG.ENDPOINTS.PAYMENTS.UPDATE(paymentId),
      paymentData
    );
    return response.data;
  }

  async deletePayment(paymentId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PAYMENTS.DELETE(paymentId));
  }
}

export class RatingsService {
  async createRating(ratingData: {
    target_id: string;
    role: string;
    score: number;
  }): Promise<unknown> {
    const response = await apiClient.post<unknown>(
      API_CONFIG.ENDPOINTS.RATINGS.CREATE,
      ratingData
    );
    return response.data;
  }

  async getAllRatings(params?: {
    target_id?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    ratings: unknown[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await apiClient.get<{
      ratings: unknown[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(API_CONFIG.ENDPOINTS.RATINGS.LIST, params);
    return response.data;
  }

  async getRating(ratingId: string): Promise<unknown> {
    const response = await apiClient.get<unknown>(
      API_CONFIG.ENDPOINTS.RATINGS.GET(ratingId)
    );
    return response.data;
  }

  async updateRating(ratingId: string, ratingData: { score: number }): Promise<unknown> {
    const response = await apiClient.put<unknown>(
      API_CONFIG.ENDPOINTS.RATINGS.UPDATE(ratingId),
      ratingData
    );
    return response.data;
  }

  async deleteRating(ratingId: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.RATINGS.DELETE(ratingId));
  }
}

export const jobsService = new JobsService();
export const housesService = new HousesService();
export const applicationsService = new ApplicationsService();
export const categoriesService = new CategoriesService();
export const profilesService = new ProfilesService();
export const paymentsService = new PaymentsService();
export const ratingsService = new RatingsService();
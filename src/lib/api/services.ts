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
  Inquiry,
  CreateInquiryRequest,
} from './config';


export class JobsService {
  async createJob(jobData: CreateJobRequest): Promise<Job> {
    // Convert image to base64 if present
    let imageBase64: string | undefined;
    if (jobData.image) {
      imageBase64 = await this.fileToBase64(jobData.image);
    }

    const jsonData = {
      title: jobData.title,
      description: jobData.description,
      requirements: JSON.stringify(jobData.requirements),
      responsibility: JSON.stringify(jobData.responsibility),
      link: jobData.link,
      status: jobData.status,
      image: imageBase64
    };

    const response = await apiClient.post<Job>(API_CONFIG.ENDPOINTS.JOBS.CREATE, jsonData);
    return response.data;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
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
    }>(API_CONFIG.ENDPOINTS.JOBS.LIST, { page, limit });
    
    
    return {
      jobs: response.data.jobs || [],
      total: response.data.meta.totalItems,
      page: response.data.meta.currentPage,
      limit: response.data.meta.perPage,
      totalPages: response.data.meta.totalPages,
    };
  }

  async getEmployerJobs(employerId: string, page = 1, limit = 10): Promise<{
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
    }>(API_CONFIG.ENDPOINTS.JOBS.EMPLOYER_LIST(employerId), { page, limit });
    
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
    // Convert images to base64 if present
    let imagesBase64: string[] | undefined;
    if (houseData.images && houseData.images.length > 0) {
      imagesBase64 = await Promise.all(
        houseData.images.map(image => this.fileToBase64(image))
      );
    }

    // Convert video to base64 if present
    let videoBase64: string | undefined;
    if (houseData.video) {
      videoBase64 = await this.fileToBase64(houseData.video);
    }

    const jsonData = {
      title: houseData.title,
      type: houseData.type,
      price: houseData.price,
      location: houseData.location,
      category_id: houseData.category_id,
      description: houseData.description,
      area: houseData.area,
      availability_date: houseData.availability_date,
      features: houseData.features ? JSON.stringify(houseData.features) : undefined,
      status: houseData.status,
      images: imagesBase64,
      video: videoBase64
    };

    const response = await apiClient.post<House>(API_CONFIG.ENDPOINTS.HOUSES.CREATE, jsonData);
    return response.data;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
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

  async getActiveHouses(page = 1, limit = 10): Promise<{
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
    }>(API_CONFIG.ENDPOINTS.HOUSES.ACTIVE, { page, limit });
    
    return {
      houses: response.data.houses || [],
      total: response.data.meta.totalItems,
      page: response.data.meta.currentPage,
      limit: response.data.meta.perPage,
      totalPages: response.data.meta.totalPages,
    };
  }

  async getHousesByOwner(ownerId: string, page = 1, limit = 10): Promise<{
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
    }>(API_CONFIG.ENDPOINTS.HOUSES.LIST, { 
      page, 
      limit, 
      owner_id: ownerId 
    });
    
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

  async getApplicationsByJob(jobId: string): Promise<{
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
    }>(API_CONFIG.ENDPOINTS.APPLICATIONS.BY_JOB(jobId));
    return response.data;
  }
}

export class CategoriesService {
  async createCategory(categoryData: { name: string }): Promise<Category> {
    const response = await apiClient.post<{
      success: boolean;
      message: string;
      data: Category;
      timestamp: string;
    }>(
      API_CONFIG.ENDPOINTS.CATEGORIES.CREATE,
      categoryData as unknown as Record<string, unknown>
    );
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any).data;
  }

  async getAllCategories(): Promise<Category[]> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        categories: Category[];
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
    }>(API_CONFIG.ENDPOINTS.CATEGORIES.LIST);
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any).data.categories;
  }

  async getCategory(categoryId: string): Promise<Category> {
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: Category;
      timestamp: string;
    }>(
      API_CONFIG.ENDPOINTS.CATEGORIES.GET(categoryId)
    );
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any).data;
  }

  async updateCategory(categoryId: string, categoryData: { name: string }): Promise<Category> {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: Category;
      timestamp: string;
    }>(
      API_CONFIG.ENDPOINTS.CATEGORIES.UPDATE(categoryId),
      categoryData
    );
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response as any).data;
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
    
    if (profileData.cv) {
      formData.append('cv', profileData.cv);
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
    
    if (profileData.cv) {
      formData.append('cv', profileData.cv);
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



export class InquiriesService {
  async createInquiry(inquiryData: CreateInquiryRequest): Promise<Inquiry> {
    const response = await apiClient.post<Inquiry>(API_CONFIG.ENDPOINTS.INQUIRIES.CREATE, inquiryData as unknown as Record<string, unknown>);
    return response.data;
  }

  async getInquiries(houseId: string): Promise<Inquiry[]> {
    const response = await apiClient.get<Inquiry[]>(API_CONFIG.ENDPOINTS.INQUIRIES.LIST, { house_id: houseId });
    return response.data;
  }

  async updateInquiry(inquiryId: string, inquiryData: Partial<CreateInquiryRequest>): Promise<Inquiry> {
    const response = await apiClient.put<Inquiry>(API_CONFIG.ENDPOINTS.INQUIRIES.UPDATE(inquiryId), inquiryData);
    return response.data;
  } 

}



export const jobsService = new JobsService();
export const housesService = new HousesService();
export const applicationsService = new ApplicationsService();
export const categoriesService = new CategoriesService();
export const profilesService = new ProfilesService();
export const paymentsService = new PaymentsService();
export const ratingsService = new RatingsService();
export const inquiriesService = new InquiriesService();
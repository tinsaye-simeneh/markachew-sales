export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? ''
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://employee.luckbingogames.com',
  ENDPOINTS: {
    ADMIN: {
      LOGIN: '/api/admin/login',
      CREATE: '/api/admin/create',
      REFRESH: '/api/admin/refresh',
      LOGOUT: '/api/admin/logout',
    },
    USERS: {
      REGISTER: process.env.NODE_ENV === 'development' ? '/api/auth/register' : '/api/users/register',
      LOGIN: process.env.NODE_ENV === 'development' ? '/api/auth/login' : '/api/users/login',
      REFRESH: '/api/users/refresh',
      LOGOUT: '/api/users/logout',
      ME: '/api/users/me',
      UPDATE: (id: string) => `/api/users/${id}`,
      DELETE: (id: string) => `/api/users/${id}`,
      LIST: '/api/users',
    },
    JOBS: {
      CREATE: process.env.NODE_ENV === 'development' ? '/api/jobs' : '/api/jobs',
      LIST: process.env.NODE_ENV === 'development' ? '/api/jobs' : '/api/jobs',
      GET: (id: string) => process.env.NODE_ENV === 'development' ? `/api/jobs/${id}` : `/api/jobs/${id}`,
      UPDATE: (id: string) => process.env.NODE_ENV === 'development' ? `/api/jobs/${id}` : `/api/jobs/${id}`,
      DELETE: (id: string) => process.env.NODE_ENV === 'development' ? `/api/jobs/${id}` : `/api/jobs/${id}`,
      APPLY: '/api/jobs/apply',
    },
    APPLICATIONS: {
      CREATE: '/api/applications',
      LIST: '/api/applications',
      GET: (id: string) => `/api/applications/${id}`,
      UPDATE: (id: string) => `/api/applications/${id}`,
      DELETE: (id: string) => `/api/applications/${id}`,
      RESTORE: (id: string) => `/api/applications/${id}/restore`,
    },
    HOUSES: {
      CREATE: process.env.NODE_ENV === 'development' ? '/api/houses' : '/api/houses',
      LIST: process.env.NODE_ENV === 'development' ? '/api/houses' : '/api/houses',
      GET: (id: string) => process.env.NODE_ENV === 'development' ? `/api/houses/${id}` : `/api/houses/${id}`,
      UPDATE: (id: string) => process.env.NODE_ENV === 'development' ? `/api/houses/${id}` : `/api/houses/${id}`,
      DELETE: (id: string) => process.env.NODE_ENV === 'development' ? `/api/houses/${id}` : `/api/houses/${id}`,
    },
    CATEGORIES: {
      CREATE: '/api/categories',
      LIST: '/api/categories',
      GET: (id: string) => `/api/categories/${id}`,
      UPDATE: (id: string) => `/api/categories/${id}`,
      DELETE: (id: string) => `/api/categories/${id}`,
    },
    PAYMENTS: {
      CREATE: '/api/payments',
      LIST: '/api/payments',
      GET: (id: string) => `/api/payments/${id}`,
      UPDATE: (id: string) => `/api/payments/${id}`,
      DELETE: (id: string) => `/api/payments/${id}`,
    },
    RATINGS: {
      CREATE: '/api/ratings',
      LIST: '/api/ratings',
      GET: (id: string) => `/api/ratings/${id}`,
      UPDATE: (id: string) => `/api/ratings/${id}`,
      DELETE: (id: string) => `/api/ratings/${id}`,
    },
    PROFILES: {
      CREATE: process.env.NODE_ENV === 'development' ? '/api/profile' : '/api/profile',
      GET: (id: string) => process.env.NODE_ENV === 'development' ? `/api/profile/${id}` : `/api/profile/${id}`,
      UPDATE: (id: string) => process.env.NODE_ENV === 'development' ? `/api/profile/${id}` : `/api/profile/${id}`,
      DELETE: (id: string) => process.env.NODE_ENV === 'development' ? `/api/profile/${id}` : `/api/profile/${id}`,
    },
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

export enum UserType {
  EMPLOYER = 'EMPLOYER',
  EMPLOYEE = 'EMPLOYEE',
  SELLER = 'SELLER',
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    jobs?: T[];
    houses?: T[];
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
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  phone: string;
  email: string;
  user_type: UserType;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  success: boolean;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  user_type: UserType;
  createdAt: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  title: string;
  description: string;
  requirements: string; // JSON string from API
  responsibility: string; // JSON string from API
  link?: string;
  image?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  employer: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface CreateJobRequest {
  title: string;
  description: string;
  requirements: Record<string, unknown>;
  responsibility: Record<string, unknown>;
  link?: string;
  image?: File;
}

export interface House {
  id: string;
  title: string;
  description?: string;
  type: 'SALES' | 'RENT';
  price: string; // API returns as string
  location: string;
  area?: string;
  features?: string; // JSON string from API
  images: string; // JSON string from API
  video?: string;
  availability_date?: string;
  status: string;
  category_id: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  category: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    full_name: string;
    email: string;
  };
}

export enum HouseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
}


export enum HouseType {
  SALES = 'SALES',
  RENT = 'RENT',
}

export enum JobStatus {
  PUBLISHED = 'PUBLISHED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface CreateHouseRequest {
  title: string;
  type: 'SALES' | 'RENT';
  price: number;
  location: string;
  category_id: string;
  images?: File[];
  video?: File;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  cover_letter: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  user_id: string;
  job_id: string;
  cover_letter: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  location: string;
  address: string;
  photo?: string;
  document?: string;
  license?: string;
  degree?: string;
  department?: string;
  experience?: number;
  availability?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  salary_expectation?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileRequest {
  user_id: string;
  location: string;
  address: string;
  photo?: File;
  document?: File;
  license?: File;
  degree?: string;
  department?: string;
  experience?: number;
  availability?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  salary_expectation?: number;
}
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
      BY_JOB: (jobId: string) => `/api/applications/job/${jobId}`,
    },
    HOUSES: {
      CREATE: process.env.NODE_ENV === 'development' ? '/api/houses' : '/api/houses',
      LIST: process.env.NODE_ENV === 'development' ? '/api/houses' : '/api/houses',
      ACTIVE: process.env.NODE_ENV === 'development' ? '/api/houses/active' : '/api/houses/active',
      GET: (id: string) => process.env.NODE_ENV === 'development' ? `/api/houses/${id}` : `/api/houses/${id}`,
      UPDATE: (id: string) => process.env.NODE_ENV === 'development' ? `/api/houses/${id}` : `/api/houses/${id}`,
      DELETE: (id: string) => process.env.NODE_ENV === 'development' ? `/api/houses/${id}` : `/api/houses/${id}`,
    },
    INQUIRIES: {
      CREATE: '/api/inquiries',
      LIST: '/api/inquiries',
      GET: (id: string) => `/api/inquiries/${id}`,
      UPDATE: (id: string) => `/api/inquiries/${id}`,
      DELETE: (id: string) => `/api/inquiries/${id}`,
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
    COMMISSIONS: {
      CREATE: '/api/commissions',
      LIST: '/api/commissions',
      GET: (id: string) => `/api/commissions/${id}`,
      UPDATE: (id: string) => `/api/commissions/${id}`,
      DELETE: (id: string) => `/api/commissions/${id}`,
    },
    SUBSCRIPTIONS: {
      CREATE: '/api/subscriptions',
      LIST: '/api/subscriptions',
      GET: (id: string) => `/api/subscriptions/${id}`,
      UPDATE: (id: string) => `/api/subscriptions/${id}`,
      DELETE: (id: string) => `/api/subscriptions/${id}`,
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
  requirements: string[] | string; // Can be array or string (for backward compatibility)
  responsibility: string[] | string; // Can be array or string (for backward compatibility)
  link?: string;
  image: string[]; // Array of image URLs
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
  requirements: string[];
  responsibility: string[];
  link?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'VERIFICATION';
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
    phone?: string;
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
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
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
  description?: string;
  area?: number;
  availability_date?: string;
  features?: string[];
  status?: string;
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
  job: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
}

export interface CreateApplicationRequest {
  user_id: string;
  job_id: string;
  cover_letter: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  user_id: string;
  location: string;
  address: string;
  photo?: string;
  document?: string;
  license?: string;
  cv?: string;
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
  cv?: File;
  degree?: string;
  department?: string;
  experience?: number;
  availability?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  salary_expectation?: number;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

// Helper function to normalize status values
export const normalizePaymentStatus = (status: string): PaymentStatus => {
  const upperStatus = status.toUpperCase()
  switch (upperStatus) {
    case 'PENDING':
      return PaymentStatus.PENDING
    case 'APPROVED':
      return PaymentStatus.APPROVED
    case 'REJECTED':
      return PaymentStatus.REJECTED
    case 'COMPLETED':
      return PaymentStatus.COMPLETED
    default:
      return PaymentStatus.PENDING
  }
}

export interface Payment {
  id: string;
  payer_id: string;
  amount: number | string; // Can be number or string from API
  receipt_image: string | null;
  status: PaymentStatus | string; // Can be enum or string from API
  createdAt: string;
  updatedAt: string;
  approved_at?: string | null;
  commission_id?: string | null;
  payer?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface CreatePaymentRequest {
  payer_id: string;
  amount: number;
  receipt_image: string;
  commission_id?: string;
}

// Commission Types
export enum CommissionType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  PER_POST = 'PER_POST',
}

export enum SubscriptionPeriod {
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum PostType {
  HOUSE = 'HOUSE',
  JOB = 'JOB',
}

export interface Commission {
  id: string;
  title: string;
  payment_type: CommissionType;
  subscription?: SubscriptionPeriod;
  per_post?: PostType;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommissionRequest {
  title: string;
  payment_type: CommissionType;
  subscription?: SubscriptionPeriod;
  per_post?: PostType;
  amount: number;
}

// Subscription Types
export interface Subscription {
  id: string;
  commission_id: string;
  subscriber_id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  commission: Commission;
  subscriber: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface CreateSubscriptionRequest {
  commission_id: string;
  subscriber_id: string;
  }

export interface Inquiry {
  id: string;
  user_id: string;
  house_id: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    };
  house: {
    id: string;
    title: string;
  };
}

export interface CreateInquiryRequest {
  user_id: string;
  house_id: string;
  message: string;
}
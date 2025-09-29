import { useState, useEffect } from 'react';
import { jobsService, housesService, categoriesService, applicationsService, inquiriesService } from '@/lib/api';
import type { Job, House, Category, CreateJobRequest, CreateHouseRequest, Application, Inquiry } from '@/lib/api/config';

export function useJobs(page = 1, limit = 10) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsService.getAllJobs(page, limit);
      setJobs(response.jobs);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, limit]);

  return { 
    jobs, 
    loading, 
    error, 
    total, 
    totalPages, 
    refetch: fetchJobs 
  };
}

export function useJob(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await jobsService.getJob(jobId);
        setJob(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return { job, loading, error };
}

export function useHouses(page = 1, limit = 10) {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await housesService.getAllHouses(page, limit);
        setHouses(response.houses);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch houses');
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, [page, limit]);

  return { houses, loading, error, total, totalPages };
}

export function useActiveHouses(page = 1, limit = 10) {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchActiveHouses = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use the new API endpoint that only returns active houses
        const response = await housesService.getActiveHouses(page, limit);
        
        setHouses(response.houses);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch active houses');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveHouses();
  }, [page, limit]);

  return { houses, loading, error, total, totalPages };
}

export function useHouse(houseId: string) {
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!houseId) return;

    const fetchHouse = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await housesService.getHouse(houseId);
        setHouse(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch house');
      } finally {
        setLoading(false);
      }
    };

    fetchHouse();
  }, [houseId]);

  return { house, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoriesService.getAllCategories();
        setCategories(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useCreateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createJob = async (jobData: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsService.createJob(jobData as unknown as CreateJobRequest);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createJob, loading, error };
}

export function useCreateHouse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createHouse = async (houseData: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await housesService.createHouse(houseData as unknown as CreateHouseRequest );
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create house');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createHouse, loading, error };
}

// Employer-specific hooks
export function useEmployerJobs(userId?: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEmployerJobs = async (page = 1, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsService.getAllJobs(page, limit);
     
    
      
      setJobs(response.jobs);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employer jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchEmployerJobs();
    }
  }, [userId]);

  return { 
    jobs, 
    loading, 
    error, 
    total, 
    totalPages, 
    refetch: fetchEmployerJobs 
  };
}

export function useUpdateJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateJob = async (jobId: string, jobData: Partial<CreateJobRequest>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsService.updateJob(jobId, jobData);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateJob, loading, error };
}

export function useDeleteJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteJob = async (jobId: string) => {
    try {
      setLoading(true);
      setError(null);
      await jobsService.deleteJob(jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteJob, loading, error };
}

export function useEmployerApplications(jobId?: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchApplications = async (page = 1, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (jobId) {
        // Use the new API route for applications by job ID
        const res = await fetch(`/api/applications/job/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        response = {
          applications: data.data?.applications || [],
          total: data.data?.meta?.totalItems || 0,
          totalPages: data.data?.meta?.totalPages || 1
        };
      } else {
        // Fetch all applications and filter by employer
        const res = await fetch(`/api/applications?page=${page}&limit=${limit}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        
        // Get current user (employer) ID
        const userData = localStorage.getItem('user');
        if (!userData) {
          throw new Error('User not found');
        }
        const user = JSON.parse(userData);
        const employerId = user.id;
        
        // Filter applications to only show those for jobs posted by this employer
        const allApplications = data.data?.applications || [];
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const employerApplications = allApplications.filter((app: any) => 
          app.job?.employer?.id === employerId
        );
        
        response = {
          applications: employerApplications,
          total: employerApplications.length,
          totalPages: Math.ceil(employerApplications.length / limit)
        };
      }
      
      setApplications(response.applications);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  return { 
    applications, 
    loading, 
    error, 
    total, 
    totalPages, 
    refetch: fetchApplications 
  };
}

export function useUpdateApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateApplication = async (applicationId: string, applicationData: Partial<Application>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await applicationsService.updateApplication(applicationId, applicationData);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update application');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateApplication, loading, error };
}

// Seller-specific hooks
export function useSellerHouses(userId?: string) {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await housesService.getAllHouses(1, 100); // Get more houses for seller
      // Filter houses by owner if userId is provided
      const sellerHouses = userId 
        ? response.houses.filter(house => house.owner?.id === userId)
        : response.houses;
      setHouses(sellerHouses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch houses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerHouses();
  }, [userId]);

  return { 
    houses, 
    loading, 
    error, 
    refetch: fetchSellerHouses 
  };
}

export function useDeleteHouse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteHouse = async (houseId: string) => {
    try {
      setLoading(true);
      setError(null);
      await housesService.deleteHouse(houseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete house');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteHouse, loading, error };
}

export function useUpdateHouse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateHouse = async (houseId: string, houseData: Partial<CreateHouseRequest>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedHouse = await housesService.updateHouse(houseId, houseData);
      return updatedHouse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update house');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateHouse, loading, error };
}

export function useSellerInquiries(houseId?: string) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await inquiriesService.getInquiries(houseId as string);
      setInquiries(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerInquiries();
  }, [houseId]);

  return { 
    inquiries, 
    loading, 
    error, 
    refetch: fetchSellerInquiries 
  };
}

export function useUpdateInquiry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateInquiry = async (inquiryId: string, applicationData: Partial<Inquiry>)  => {
    try {
      setLoading(true);
      setError(null);
      const updatedInquiry = await applicationsService.updateApplication(inquiryId, applicationData);
      return updatedInquiry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update inquiry');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateInquiry, loading, error };
}
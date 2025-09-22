import { useState, useEffect } from 'react';
import { jobsService, housesService, categoriesService } from '@/lib/api';
import type { Job, House, Category, CreateJobRequest, CreateHouseRequest } from '@/lib/api/config';

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
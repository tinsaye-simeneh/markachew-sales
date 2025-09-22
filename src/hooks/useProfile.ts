import { useState, useEffect } from 'react';
import { profilesService } from '@/lib/api';
import type { Profile, CreateProfileRequest } from '@/lib/api';

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileData = await profilesService.getProfile(userId);
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}

export function useCurrentUserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileData = await profilesService.getCurrentUserProfile();
        setProfile(profileData);
      } catch (err) {
        if (err instanceof Error && (err.message.includes('404') || err.message.includes('Profile not found'))) {
          setProfile(null); // This will trigger the create profile flow
          setError(null); // Clear error for 404
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  return { profile, loading, error };
}

export function useCreateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = async (profileData: CreateProfileRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newProfile = await profilesService.createProfile(profileData);
      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProfile, loading, error };
}

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (userId: string, profileData: Partial<CreateProfileRequest>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedProfile = await profilesService.updateProfile(userId, profileData);
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading, error };
}
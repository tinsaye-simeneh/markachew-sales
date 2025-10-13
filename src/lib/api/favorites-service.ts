import { apiClient } from './client';

export interface Favorite {
  id: string;
  type: 'HOUSE' | 'JOB';
  favorite_id: string;
  user_id: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    user_type: string;
  };
  item: {
    id: string;
    title: string;
    price?: string;
    location?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface ToggleFavoriteRequest {
  type: 'HOUSE' | 'JOB';
  favorite_id: string;
}

export interface FavoritesResponse {
  success: boolean;
  message: string;
  data: {
    favorites: Favorite[];
    pagination: {
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

export interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  data: Favorite | null;
  timestamp: string;
}

export class FavoritesService {
  async getFavorites(type?: 'HOUSE' | 'JOB'): Promise<Favorite[]> {
    try {
      const params: Record<string, string> = {};
      if (type) {
        params.type = type;
      }
      
      const response = await apiClient.get<FavoritesResponse>('/api/favorites', params);
      
      if (response.success && response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any;
        if (data.favorites && Array.isArray(data.favorites)) {
          return data.favorites;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  async toggleFavorite(request: ToggleFavoriteRequest): Promise<{ favorite?: Favorite; isAdded: boolean }> {
    try {
      const response = await apiClient.post<ToggleFavoriteResponse>('/api/favorites/toggle', request as unknown as Record<string, unknown>);
      
      if (response.success) {
        const isAdded = response.data !== null;
        
        return {
          favorite: response.data ? (response.data as unknown as Favorite) : undefined,
          isAdded: isAdded
        };
      }
      
      throw new Error(response.message || 'Failed to toggle favorite');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  async addFavorite(type: 'HOUSE' | 'JOB', favoriteId: string): Promise<Favorite> {
    try {
      const result = await this.toggleFavorite({ type, favorite_id: favoriteId });
      
      if (result.isAdded && result.favorite) {
        return result.favorite;
      }
      
      throw new Error('Failed to add favorite');
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(type: 'HOUSE' | 'JOB', favoriteId: string): Promise<void> {
    try {
      const result = await this.toggleFavorite({ type, favorite_id: favoriteId });
      
      if (!result.isAdded) {
        return; // Successfully removed
      }
      
      throw new Error('Failed to remove favorite');
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }
}

export const favoritesService = new FavoritesService();
import { apiClient } from './client';
import { API_CONFIG } from './config';
import { 
  Subscription, 
  CreateSubscriptionRequest,
} from './config';

export class SubscriptionService {
  async createSubscription(subscriptionData: CreateSubscriptionRequest): Promise<Subscription> {
    const response = await apiClient.post<Subscription>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.CREATE, 
      subscriptionData as unknown as Record<string, unknown>
    );
    return response.data;
  }

  async getSubscriptions(): Promise<Subscription[]> {
    const response = await apiClient.get<{ subscriptions: Subscription[] }>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.LIST
    );
    return response.data.subscriptions || [];
  }

  async getSubscription(id: string): Promise<Subscription> {
    const response = await apiClient.get<Subscription>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.GET(id)
    );
    return response.data;
  }

  async updateSubscription(id: string, subscriptionData: Partial<CreateSubscriptionRequest>): Promise<Subscription> {
    const response = await apiClient.put<Subscription>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.UPDATE(id), 
      subscriptionData
    );
    return response.data;
  }

  async deleteSubscription(id: string): Promise<void> {
    const response = await apiClient.delete<void>(
      API_CONFIG.ENDPOINTS.SUBSCRIPTIONS.DELETE(id)
    );
    return response.data;
  }

  // Get user's active subscription
  async getUserActiveSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subscriptions = await this.getSubscriptions();
      const activeSubscription = subscriptions.find(
        sub => sub.subscriber_id === userId && sub.status === 'ACTIVE'
      );
      return activeSubscription || null;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }
}
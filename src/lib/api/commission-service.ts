import { apiClient } from './client';
import { API_CONFIG } from './config';
import { 
  Commission, 
  CreateCommissionRequest, 
} from './config';

export class CommissionService {
  async createCommission(): Promise<Commission> {
    const response = await apiClient.post<Commission>(
      API_CONFIG.ENDPOINTS.COMMISSIONS.CREATE
    );
    return response.data;
  }

  async getCommissions(): Promise<Commission[]> {
    const response = await apiClient.get<{ commissions: Commission[] }>(
      API_CONFIG.ENDPOINTS.COMMISSIONS.LIST
    );
    return response.data.commissions || [];
  }

  async getCommission(id: string): Promise<Commission> {
    const response = await apiClient.get<Commission>(
      API_CONFIG.ENDPOINTS.COMMISSIONS.GET(id)
    );
    return response.data;
  }

  async updateCommission(id: string, commissionData: Partial<CreateCommissionRequest>): Promise<Commission> {
    const response = await apiClient.put<Commission>(
      API_CONFIG.ENDPOINTS.COMMISSIONS.UPDATE(id), 
      commissionData
    );
    return response.data;
  }

  async deleteCommission(id: string): Promise<void> {
    const response = await apiClient.delete<void>(
      API_CONFIG.ENDPOINTS.COMMISSIONS.DELETE(id)
    );
    return response.data;
  }
}
import { apiClient } from "@/lib/api/client";
import {
  TenantSummaryResponse,
  CreateTenantRequest,
  SuperAdminMetricsResponse,
  UUID,
} from "@/types/api";

export const SuperAdminService = {
  getTenants: async (): Promise<TenantSummaryResponse[]> => {
    return apiClient.superAdmin.getTenants();
  },

  createTenant: async (data: CreateTenantRequest): Promise<TenantSummaryResponse> => {
    return apiClient.superAdmin.createTenant(data);
  },

  toggleTenantStatus: async (id: UUID, active: boolean): Promise<TenantSummaryResponse> => {
    return apiClient.superAdmin.toggleTenantStatus(id, active);
  },

  getMetrics: async (): Promise<SuperAdminMetricsResponse> => {
    return apiClient.superAdmin.getMetrics();
  },
};

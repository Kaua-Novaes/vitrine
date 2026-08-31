import { apiClient } from "@/lib/api/client";
import {
  StorePublicResponse,
  StoreSettingsResponse,
  UpdateStoreSettingsRequest,
} from "@/types/api";

export const StoreService = {
  getPublicInfo: async (): Promise<StorePublicResponse> => {
    return apiClient.public.getStore();
  },

  getAdminSettings: async (): Promise<StoreSettingsResponse> => {
    return apiClient.admin.settings.get();
  },

  updateAdminSettings: async (data: UpdateStoreSettingsRequest): Promise<StoreSettingsResponse> => {
    return apiClient.admin.settings.update(data);
  },
};

import { apiClient } from "@/lib/api/client";
import { BannerResponse, BannerInput } from "@/types/api";

export const BannerService = {
  getPublicBanners: async (): Promise<BannerResponse[]> => {
    return apiClient.public.getBanners();
  },

  getAdminBanners: async (): Promise<BannerResponse[]> => {
    return apiClient.admin.banners.list();
  },

  createBanner: async (input: BannerInput): Promise<BannerResponse> => {
    return apiClient.admin.banners.create(input);
  },

  updateBanner: async (id: string, input: BannerInput): Promise<BannerResponse> => {
    return apiClient.admin.banners.update(id, input);
  },

  deleteBanner: async (id: string): Promise<void> => {
    return apiClient.admin.banners.delete(id);
  },
};

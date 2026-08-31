import { apiClient } from "@/lib/api/client";
import { HomeSectionsResponse } from "@/types/api";

export const HomeService = {
  getPublicHome: async (): Promise<HomeSectionsResponse> => {
    return apiClient.public.getHome();
  },
};

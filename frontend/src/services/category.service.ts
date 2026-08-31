import { apiClient } from "@/lib/api/client";
import { CategoryResponse, CategoryInput, ProductPageResponse } from "@/types/api";

export const CategoryService = {
  getPublicCategories: async (): Promise<CategoryResponse[]> => {
    return apiClient.public.getCategories();
  },

  getCategoryBySlug: async (slug: string): Promise<CategoryResponse> => {
    return apiClient.public.getCategoryBySlug(slug);
  },

  getCategoryProducts: async (slug: string, page = 0, size = 20): Promise<ProductPageResponse> => {
    return apiClient.public.getCategoryProducts(slug, page, size);
  },

  getAdminCategories: async (): Promise<CategoryResponse[]> => {
    return apiClient.admin.categories.list();
  },

  getAdminCategoryById: async (id: string): Promise<CategoryResponse> => {
    return apiClient.admin.categories.getById(id);
  },

  createCategory: async (input: CategoryInput): Promise<CategoryResponse> => {
    return apiClient.admin.categories.create(input);
  },

  updateCategory: async (id: string, input: CategoryInput): Promise<CategoryResponse> => {
    return apiClient.admin.categories.update(id, input);
  },

  deleteCategory: async (id: string): Promise<void> => {
    return apiClient.admin.categories.delete(id);
  },
};

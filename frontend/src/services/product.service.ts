import { apiClient } from "@/lib/api/client";
import { ProductPageResponse, ProductDetailResponse, ProductInput } from "@/types/api";

export const ProductService = {
  getPublicProducts: async (
    query?: string,
    categorySlug?: string,
    page = 0,
    size = 20
  ): Promise<ProductPageResponse> => {
    return apiClient.public.getProducts(query, categorySlug, page, size);
  },

  getProductBySlug: async (slug: string): Promise<ProductDetailResponse> => {
    return apiClient.public.getProductBySlug(slug);
  },

  getAdminProducts: async (page = 0, size = 20, search?: string): Promise<ProductPageResponse> => {
    return apiClient.admin.products.list(page, size, search);
  },

  getAdminProductById: async (id: string): Promise<ProductDetailResponse> => {
    return apiClient.admin.products.getById(id);
  },

  createProduct: async (input: ProductInput): Promise<ProductDetailResponse> => {
    return apiClient.admin.products.create(input);
  },

  updateProduct: async (id: string, input: ProductInput): Promise<ProductDetailResponse> => {
    return apiClient.admin.products.update(id, input);
  },

  deleteProduct: async (id: string): Promise<void> => {
    return apiClient.admin.products.delete(id);
  },
};

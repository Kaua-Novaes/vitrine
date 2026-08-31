import {
  ErrorResponse,
  StorePublicResponse,
  StoreSettingsResponse,
  UpdateStoreSettingsRequest,
  HomeSectionsResponse,
  BannerResponse,
  BannerInput,
  CategoryResponse,
  CategoryInput,
  ProductDetailResponse,
  ProductInput,
  ProductPageResponse,
  TestimonialResponse,
  TestimonialInput,
  MediaUploadResponse,
  LoginRequest,
  LoginResponse,
  UserResponse,
  TenantSummaryResponse,
  CreateTenantRequest,
  SuperAdminMetricsResponse,
  UUID,
} from "@/types/api";

import {
  mockStorePublic,
  mockStoreSettings,
  mockBanners,
  mockCategories,
  mockProducts,
  mockTestimonials,
  mockHomeSections,
  mockUser,
  mockTenants,
  mockSuperAdminMetrics,
} from "@/mocks/data";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export class ApiError extends Error {
  constructor(
    public status: number,
    public errorData: ErrorResponse
  ) {
    super(errorData.detail || errorData.title || `HTTP Error ${status}`);
    this.name = "ApiError";
  }
}

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined" &&
    typeof window.localStorage.setItem === "function"
  ) {
    if (token) {
      window.localStorage.setItem("auth_token", token);
    } else {
      window.localStorage.removeItem("auth_token");
    }
  }
};

export const getAuthToken = (): string | null => {
  if (
    !authToken &&
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined" &&
    typeof window.localStorage.getItem === "function"
  ) {
    authToken = window.localStorage.getItem("auth_token");
  }
  return authToken;
};

// Helper fetch wrapper
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || "grafica-express";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-Slug": tenantSlug,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        status: response.status,
        title: response.statusText,
        detail: "Erro inesperado na comunicação com o servidor.",
        timestamp: new Date().toISOString(),
      };
    }
    throw new ApiError(response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Cliente da API unificado (com chaveamento transparente para Mock API).
 */
export const apiClient = {
  public: {
    getStore: async (): Promise<StorePublicResponse> => {
      if (USE_MOCK) return mockStorePublic;
      return request<StorePublicResponse>("/public/store");
    },

    getHome: async (): Promise<HomeSectionsResponse> => {
      if (USE_MOCK) return mockHomeSections;
      return request<HomeSectionsResponse>("/public/home");
    },

    getBanners: async (): Promise<BannerResponse[]> => {
      if (USE_MOCK) return mockBanners.filter((b) => b.active);
      return request<BannerResponse[]>("/public/banners");
    },

    getCategories: async (): Promise<CategoryResponse[]> => {
      if (USE_MOCK) return mockCategories.filter((c) => c.active);
      return request<CategoryResponse[]>("/public/categories");
    },

    getCategoryBySlug: async (slug: string): Promise<CategoryResponse> => {
      if (USE_MOCK) {
        const cat = mockCategories.find((c) => c.slug === slug);
        if (!cat) {
          throw new ApiError(404, {
            status: 404,
            title: "Not Found",
            detail: `Categoria ${slug} não encontrada`,
          });
        }
        return cat;
      }
      return request<CategoryResponse>(`/public/categories/${slug}`);
    },

    getCategoryProducts: async (
      slug: string,
      page = 0,
      size = 20
    ): Promise<ProductPageResponse> => {
      if (USE_MOCK) {
        const filtered = mockProducts.filter((p) => p.categories.some((c) => c.slug === slug));
        const summaries = filtered.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          primaryImageUrl: p.images[0]?.imageUrl || null,
          featured: p.featured,
          displayOrder: p.displayOrder,
          active: p.active,
        }));
        return {
          content: summaries,
          page,
          size,
          totalElements: summaries.length,
          totalPages: Math.ceil(summaries.length / size) || 1,
          last: true,
        };
      }
      return request<ProductPageResponse>(
        `/public/categories/${slug}/products?page=${page}&size=${size}`
      );
    },

    getProducts: async (
      query?: string,
      categorySlug?: string,
      page = 0,
      size = 20
    ): Promise<ProductPageResponse> => {
      if (USE_MOCK) {
        let list = [...mockProducts];
        if (categorySlug) {
          list = list.filter((p) => p.categories.some((c) => c.slug === categorySlug));
        }
        if (query) {
          const q = query.toLowerCase();
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
          );
        }
        const summaries = list.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription,
          primaryImageUrl: p.images[0]?.imageUrl || null,
          featured: p.featured,
          displayOrder: p.displayOrder,
          active: p.active,
        }));
        return {
          content: summaries,
          page,
          size,
          totalElements: summaries.length,
          totalPages: Math.ceil(summaries.length / size) || 1,
          last: true,
        };
      }
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (categorySlug) params.append("categorySlug", categorySlug);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return request<ProductPageResponse>(`/public/products?${params.toString()}`);
    },

    getProductBySlug: async (slug: string): Promise<ProductDetailResponse> => {
      if (USE_MOCK) {
        const prod = mockProducts.find((p) => p.slug === slug);
        if (!prod) {
          throw new ApiError(404, {
            status: 404,
            title: "Not Found",
            detail: `Produto ${slug} não encontrado`,
          });
        }
        return prod;
      }
      return request<ProductDetailResponse>(`/public/products/${slug}`);
    },

    getTestimonials: async (): Promise<TestimonialResponse[]> => {
      if (USE_MOCK) return mockTestimonials.filter((t) => t.active);
      return request<TestimonialResponse[]>("/public/testimonials");
    },
  },

  admin: {
    auth: {
      login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        if (USE_MOCK) {
          if (credentials.email && credentials.password) {
            const token = "mock-jwt-token-master-access";
            setAuthToken(token);
            return {
              token,
              tokenType: "Bearer",
              user: mockUser,
            };
          }
          throw new ApiError(401, {
            status: 401,
            title: "Unauthorized",
            detail: "E-mail ou senha incorretos.",
          });
        }
        const res = await request<LoginResponse>("/admin/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
        setAuthToken(res.token);
        return res;
      },

      me: async (): Promise<UserResponse> => {
        if (USE_MOCK) return mockUser;
        return request<UserResponse>("/admin/auth/me");
      },
    },

    settings: {
      get: async (): Promise<StoreSettingsResponse> => {
        if (USE_MOCK) return mockStoreSettings;
        return request<StoreSettingsResponse>("/admin/settings");
      },

      update: async (data: UpdateStoreSettingsRequest): Promise<StoreSettingsResponse> => {
        if (USE_MOCK) {
          Object.assign(mockStoreSettings, data);
          return mockStoreSettings;
        }
        return request<StoreSettingsResponse>("/admin/settings", {
          method: "PUT",
          body: JSON.stringify(data),
        });
      },
    },

    categories: {
      list: async (): Promise<CategoryResponse[]> => {
        if (USE_MOCK) return mockCategories;
        return request<CategoryResponse[]>("/admin/categories");
      },

      create: async (input: CategoryInput): Promise<CategoryResponse> => {
        if (USE_MOCK) {
          const newCat: CategoryResponse = {
            id: `cat-${Date.now()}`,
            name: input.name,
            slug: input.slug,
            description: input.description || null,
            imageUrl: input.imageUrl || null,
            displayOrder: input.displayOrder ?? mockCategories.length + 1,
            active: input.active ?? true,
          };
          mockCategories.push(newCat);
          return newCat;
        }
        return request<CategoryResponse>("/admin/categories", {
          method: "POST",
          body: JSON.stringify(input),
        });
      },

      getById: async (id: string): Promise<CategoryResponse> => {
        if (USE_MOCK) {
          const cat = mockCategories.find((c) => c.id === id);
          if (!cat) throw new ApiError(404, { status: 404, detail: "Categoria não encontrada" });
          return cat;
        }
        return request<CategoryResponse>(`/admin/categories/${id}`);
      },

      update: async (id: string, input: CategoryInput): Promise<CategoryResponse> => {
        if (USE_MOCK) {
          const idx = mockCategories.findIndex((c) => c.id === id);
          if (idx === -1)
            throw new ApiError(404, { status: 404, detail: "Categoria não encontrada" });
          mockCategories[idx] = { ...mockCategories[idx], ...input };
          return mockCategories[idx];
        }
        return request<CategoryResponse>(`/admin/categories/${id}`, {
          method: "PUT",
          body: JSON.stringify(input),
        });
      },

      delete: async (id: string): Promise<void> => {
        if (USE_MOCK) {
          const idx = mockCategories.findIndex((c) => c.id === id);
          if (idx !== -1) mockCategories.splice(idx, 1);
          return;
        }
        return request<void>(`/admin/categories/${id}`, { method: "DELETE" });
      },
    },

    products: {
      list: async (page = 0, size = 20, search?: string): Promise<ProductPageResponse> => {
        if (USE_MOCK) {
          let list = [...mockProducts];
          if (search) {
            list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
          }
          const summaries = list.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            shortDescription: p.shortDescription,
            primaryImageUrl: p.images[0]?.imageUrl || null,
            featured: p.featured,
            displayOrder: p.displayOrder,
            active: p.active,
          }));
          return {
            content: summaries,
            page,
            size,
            totalElements: summaries.length,
            totalPages: Math.ceil(summaries.length / size) || 1,
            last: true,
          };
        }
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", size.toString());
        if (search) params.append("search", search);
        return request<ProductPageResponse>(`/admin/products?${params.toString()}`);
      },

      create: async (input: ProductInput): Promise<ProductDetailResponse> => {
        if (USE_MOCK) {
          const categories = mockCategories.filter((c) => input.categoryIds?.includes(c.id));
          const images = (input.imageUrls || []).map((url, i) => ({
            id: `img-${Date.now()}-${i}`,
            imageUrl: url,
            displayOrder: i + 1,
          }));
          const newProduct: ProductDetailResponse = {
            id: `prod-${Date.now()}`,
            name: input.name,
            slug: input.slug,
            shortDescription: input.shortDescription || null,
            description: input.description || null,
            featured: input.featured ?? false,
            displayOrder: input.displayOrder ?? mockProducts.length + 1,
            active: input.active ?? true,
            categories,
            images,
            relatedProducts: [],
          };
          mockProducts.push(newProduct);
          return newProduct;
        }
        return request<ProductDetailResponse>("/admin/products", {
          method: "POST",
          body: JSON.stringify(input),
        });
      },

      getById: async (id: string): Promise<ProductDetailResponse> => {
        if (USE_MOCK) {
          const prod = mockProducts.find((p) => p.id === id);
          if (!prod) throw new ApiError(404, { status: 404, detail: "Produto não encontrado" });
          return prod;
        }
        return request<ProductDetailResponse>(`/admin/products/${id}`);
      },

      update: async (id: string, input: ProductInput): Promise<ProductDetailResponse> => {
        if (USE_MOCK) {
          const idx = mockProducts.findIndex((p) => p.id === id);
          if (idx === -1)
            throw new ApiError(404, { status: 404, detail: "Produto não encontrado" });
          const current = mockProducts[idx];
          const categories = input.categoryIds
            ? mockCategories.filter((c) => input.categoryIds?.includes(c.id))
            : current.categories;
          const images = input.imageUrls
            ? input.imageUrls.map((url, i) => ({
                id: `img-${Date.now()}-${i}`,
                imageUrl: url,
                displayOrder: i + 1,
              }))
            : current.images;

          mockProducts[idx] = {
            ...current,
            name: input.name ?? current.name,
            slug: input.slug ?? current.slug,
            shortDescription: input.shortDescription ?? current.shortDescription,
            description: input.description ?? current.description,
            featured: input.featured ?? current.featured,
            displayOrder: input.displayOrder ?? current.displayOrder,
            active: input.active ?? current.active,
            categories,
            images,
          };
          return mockProducts[idx];
        }
        return request<ProductDetailResponse>(`/admin/products/${id}`, {
          method: "PUT",
          body: JSON.stringify(input),
        });
      },

      delete: async (id: string): Promise<void> => {
        if (USE_MOCK) {
          const idx = mockProducts.findIndex((p) => p.id === id);
          if (idx !== -1) mockProducts.splice(idx, 1);
          return;
        }
        return request<void>(`/admin/products/${id}`, { method: "DELETE" });
      },
    },

    banners: {
      list: async (): Promise<BannerResponse[]> => {
        if (USE_MOCK) return mockBanners;
        return request<BannerResponse[]>("/admin/banners");
      },

      create: async (input: BannerInput): Promise<BannerResponse> => {
        if (USE_MOCK) {
          const newBanner: BannerResponse = {
            id: `banner-${Date.now()}`,
            title: input.title,
            desktopImageUrl: input.desktopImageUrl,
            mobileImageUrl: input.mobileImageUrl,
            linkUrl: input.linkUrl || null,
            displayOrder: input.displayOrder ?? mockBanners.length + 1,
            active: input.active ?? true,
          };
          mockBanners.push(newBanner);
          return newBanner;
        }
        return request<BannerResponse>("/admin/banners", {
          method: "POST",
          body: JSON.stringify(input),
        });
      },

      update: async (id: string, input: BannerInput): Promise<BannerResponse> => {
        if (USE_MOCK) {
          const idx = mockBanners.findIndex((b) => b.id === id);
          if (idx === -1) throw new ApiError(404, { status: 404, detail: "Banner não encontrado" });
          mockBanners[idx] = {
            ...mockBanners[idx],
            ...input,
            linkUrl: input.linkUrl ?? mockBanners[idx].linkUrl,
          };
          return mockBanners[idx];
        }
        return request<BannerResponse>(`/admin/banners/${id}`, {
          method: "PUT",
          body: JSON.stringify(input),
        });
      },

      delete: async (id: string): Promise<void> => {
        if (USE_MOCK) {
          const idx = mockBanners.findIndex((b) => b.id === id);
          if (idx !== -1) mockBanners.splice(idx, 1);
          return;
        }
        return request<void>(`/admin/banners/${id}`, { method: "DELETE" });
      },
    },

    testimonials: {
      list: async (): Promise<TestimonialResponse[]> => {
        if (USE_MOCK) return mockTestimonials;
        return request<TestimonialResponse[]>("/admin/testimonials");
      },

      create: async (input: TestimonialInput): Promise<TestimonialResponse> => {
        if (USE_MOCK) {
          const newTestimonial: TestimonialResponse = {
            id: `test-${Date.now()}`,
            name: input.name,
            text: input.text,
            displayOrder: input.displayOrder ?? mockTestimonials.length + 1,
            active: input.active ?? true,
          };
          mockTestimonials.push(newTestimonial);
          return newTestimonial;
        }
        return request<TestimonialResponse>("/admin/testimonials", {
          method: "POST",
          body: JSON.stringify(input),
        });
      },

      update: async (id: string, input: TestimonialInput): Promise<TestimonialResponse> => {
        if (USE_MOCK) {
          const idx = mockTestimonials.findIndex((t) => t.id === id);
          if (idx === -1)
            throw new ApiError(404, { status: 404, detail: "Depoimento não encontrado" });
          mockTestimonials[idx] = { ...mockTestimonials[idx], ...input };
          return mockTestimonials[idx];
        }
        return request<TestimonialResponse>(`/admin/testimonials/${id}`, {
          method: "PUT",
          body: JSON.stringify(input),
        });
      },

      delete: async (id: string): Promise<void> => {
        if (USE_MOCK) {
          const idx = mockTestimonials.findIndex((t) => t.id === id);
          if (idx !== -1) mockTestimonials.splice(idx, 1);
          return;
        }
        return request<void>(`/admin/testimonials/${id}`, { method: "DELETE" });
      },
    },

    media: {
      upload: async (
        file: File,
        folder: "logo" | "banners" | "categories" | "products"
      ): Promise<MediaUploadResponse> => {
        if (USE_MOCK) {
          return {
            url: `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&auto=format&fit=crop&q=80`,
            fileName: `${folder}-${Date.now()}.webp`,
            size: file.size || 102400,
            mimeType: file.type || "image/webp",
          };
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const token = getAuthToken();
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${BASE_URL}/admin/media/upload`, {
          method: "POST",
          headers,
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new ApiError(res.status, err);
        }
        return res.json();
      },
    },
  },

  superAdmin: {
    getTenants: async (): Promise<TenantSummaryResponse[]> => {
      if (USE_MOCK) {
        return mockTenants;
      }
      return request<TenantSummaryResponse[]>("/super-admin/tenants");
    },

    createTenant: async (data: CreateTenantRequest): Promise<TenantSummaryResponse> => {
      if (USE_MOCK) {
        const newTenant: TenantSummaryResponse = {
          id: `t-${Date.now()}`,
          name: data.name,
          slug: data.slug,
          ownerName: data.ownerName,
          ownerEmail: data.ownerEmail,
          active: true,
          productCount: 0,
          createdAt: new Date().toISOString(),
        };
        mockTenants.unshift(newTenant);
        return newTenant;
      }
      return request<TenantSummaryResponse>("/super-admin/tenants", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    toggleTenantStatus: async (id: UUID, active: boolean): Promise<TenantSummaryResponse> => {
      if (USE_MOCK) {
        const found = mockTenants.find((t) => t.id === id);
        if (found) {
          found.active = active;
          return { ...found };
        }
        throw new Error("Tenant não encontrado");
      }
      return request<TenantSummaryResponse>(`/super-admin/tenants/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ active }),
      });
    },

    getMetrics: async (): Promise<SuperAdminMetricsResponse> => {
      if (USE_MOCK) {
        return {
          ...mockSuperAdminMetrics,
          totalTenants: mockTenants.length,
          activeTenants: mockTenants.filter((t) => t.active).length,
          totalProducts: mockTenants.reduce((acc, t) => acc + t.productCount, 0),
        };
      }
      return request<SuperAdminMetricsResponse>("/super-admin/metrics");
    },
  },
};

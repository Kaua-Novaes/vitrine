/**
 * Tipos TypeScript gerados e mapeados a partir do docs/api/openapi.yaml
 */

export type UUID = string;

export interface ErrorResponse {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  timestamp?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface StorePublicResponse {
  id: UUID;
  name: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  whatsappNumber: string | null;
  whatsappMessageTemplate: string | null;
}

export interface StoreSettingsResponse {
  id: UUID;
  storeName: string;
  slug: string;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  whatsappNumber: string | null;
  whatsappMessageTemplate: string | null;
}

export interface UpdateStoreSettingsRequest {
  storeName?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  whatsappNumber?: string;
  whatsappMessageTemplate?: string;
}

export type HomeSectionType =
  "BANNER" | "CATEGORY_SHOWCASE" | "PRODUCT_SHOWCASE" | "TESTIMONIAL" | "CTA";

export interface HomeSectionOrder {
  type: HomeSectionType;
  displayOrder: number;
  active: boolean;
}

export interface HomeSectionsResponse {
  banners: BannerResponse[];
  featuredCategories: CategoryResponse[];
  featuredProducts: ProductSummaryResponse[];
  testimonials: TestimonialResponse[];
  sectionsOrder: HomeSectionOrder[];
}

export interface BannerResponse {
  id: UUID;
  title: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  linkUrl: string | null;
  displayOrder: number;
  active: boolean;
}

export interface BannerInput {
  title: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  linkUrl?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface CategoryResponse {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  active: boolean;
}

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  active?: boolean;
}

export interface ProductImageItem {
  id: UUID;
  imageUrl: string;
  displayOrder: number;
}

export interface ProductSummaryResponse {
  id: UUID;
  name: string;
  slug: string;
  shortDescription: string | null;
  primaryImageUrl: string | null;
  featured: boolean;
  displayOrder: number;
  active: boolean;
}

export interface ProductDetailResponse {
  id: UUID;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  featured: boolean;
  displayOrder: number;
  active: boolean;
  images: ProductImageItem[];
  categories: CategoryResponse[];
  relatedProducts: ProductSummaryResponse[];
}

export interface ProductInput {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  featured?: boolean;
  displayOrder?: number;
  active?: boolean;
  categoryIds?: UUID[];
  imageUrls?: string[];
}

export interface ProductPageResponse {
  content: ProductSummaryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface TestimonialResponse {
  id: UUID;
  name: string;
  text: string;
  displayOrder: number;
  active: boolean;
}

export interface TestimonialInput {
  name: string;
  text: string;
  displayOrder?: number;
  active?: boolean;
}

export interface MediaUploadResponse {
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: UUID;
  tenantId: UUID;
  name: string;
  email: string;
  role: "MASTER" | "ADMIN" | "EDITOR";
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  user: UserResponse;
}

export interface TenantSummaryResponse {
  id: UUID;
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  active: boolean;
  productCount: number;
  createdAt: string;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword?: string;
}

export interface SuperAdminMetricsResponse {
  totalTenants: number;
  activeTenants: number;
  totalProducts: number;
  monthlyGrowthRate: string;
}

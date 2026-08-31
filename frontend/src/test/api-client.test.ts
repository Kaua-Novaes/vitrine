import { describe, it, expect } from "vitest";
import { apiClient } from "@/lib/api/client";
import { StoreService } from "@/services/store.service";
import { CategoryService } from "@/services/category.service";
import { ProductService } from "@/services/product.service";
import { BannerService } from "@/services/banner.service";
import { TestimonialService } from "@/services/testimonial.service";

describe("Frontend API Client & Mock System", () => {
  it("should fetch public store settings via mock", async () => {
    const store = await StoreService.getPublicInfo();
    expect(store).toBeDefined();
    expect(store.name).toContain("Gráfica");
    expect(store.whatsappNumber).toBeDefined();
  });

  it("should fetch public categories list", async () => {
    const categories = await CategoryService.getPublicCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty("slug");
    expect(categories[0].active).toBe(true);
  });

  it("should fetch category by slug", async () => {
    const category = await CategoryService.getCategoryBySlug("cartoes-de-visita");
    expect(category).toBeDefined();
    expect(category.slug).toBe("cartoes-de-visita");
  });

  it("should fetch public products page", async () => {
    const page = await ProductService.getPublicProducts();
    expect(page.content).toBeDefined();
    expect(Array.isArray(page.content)).toBe(true);
    expect(page.totalElements).toBeGreaterThan(0);
  });

  it("should fetch product details by slug", async () => {
    const product = await ProductService.getProductBySlug(
      "cartao-de-visita-couche-300g-verniz-localizado"
    );
    expect(product).toBeDefined();
    expect(product.images.length).toBeGreaterThan(0);
    expect(product.categories.length).toBeGreaterThan(0);
  });

  it("should fetch public banners and filter only active", async () => {
    const banners = await BannerService.getPublicBanners();
    expect(banners.every((b) => b.active)).toBe(true);
  });

  it("should fetch testimonials", async () => {
    const testimonials = await TestimonialService.getPublicTestimonials();
    expect(testimonials.length).toBeGreaterThan(0);
  });

  it("should support admin auth login in mock mode", async () => {
    const res = await apiClient.admin.auth.login({
      email: "admin@vitrine.com.br",
      password: "password123",
    });
    expect(res.token).toBeDefined();
    expect(res.user.role).toBe("MASTER");
  });
});

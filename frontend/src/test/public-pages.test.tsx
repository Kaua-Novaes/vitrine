import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/public/ProductGrid";
import { CategoryCard } from "@/components/public/CategoryGrid";
import { BannerSlider } from "@/components/public/BannerSlider";
import { TestimonialSection } from "@/components/public/TestimonialSection";
import { mockProductSummaries, mockCategories, mockBanners, mockTestimonials } from "@/mocks/data";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ slug: "cartao-de-visita-couche-300g-verniz-localizado" }),
}));

describe("Public Components Suite", () => {
  it("should render ProductCard with title and badge", () => {
    render(<ProductCard product={mockProductSummaries[0]} />);
    expect(screen.getByText(mockProductSummaries[0].name)).toBeInTheDocument();
    if (mockProductSummaries[0].featured) {
      expect(screen.getByText("Destaque")).toBeInTheDocument();
    }
  });

  it("should render CategoryCard with category name", () => {
    render(<CategoryCard category={mockCategories[0]} />);
    expect(screen.getByText(mockCategories[0].name)).toBeInTheDocument();
  });

  it("should render BannerSlider with banner title", () => {
    render(<BannerSlider banners={mockBanners} />);
    expect(screen.getByText(mockBanners[0].title)).toBeInTheDocument();
  });

  it("should render TestimonialSection with client quotes", () => {
    render(<TestimonialSection testimonials={mockTestimonials} />);
    expect(screen.getByText(mockTestimonials[0].name)).toBeInTheDocument();
  });
});

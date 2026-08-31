"use client";

import React, { useState, useEffect } from "react";
import { HomeService } from "@/services/home.service";
import { HomeSectionsResponse } from "@/types/api";
import { BannerSlider } from "@/components/public/BannerSlider";
import { CategoryGrid } from "@/components/public/CategoryGrid";
import { ProductGrid } from "@/components/public/ProductGrid";
import { TestimonialSection } from "@/components/public/TestimonialSection";
import { CtaSection } from "@/components/public/CtaSection";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function HomePage() {
  const [data, setData] = useState<HomeSectionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await HomeService.getPublicHome();
      setData(res);
    } catch (err: unknown) {
      console.error("Erro ao carregar home:", err);
      setError("Não foi possível carregar a página inicial no momento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Carregando vitrine..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4">
        <ErrorState
          title="Erro ao carregar vitrine"
          message={error || "Erro desconhecido"}
          onRetry={loadData}
        />
      </div>
    );
  }

  // Render dynamic home sections according to sectionsOrder
  return (
    <div>
      {data.sectionsOrder?.map((section, idx) => {
        if (!section.active) return null;

        switch (section.type) {
          case "BANNER":
            return <BannerSlider key={idx} banners={data.banners} />;
          case "CATEGORY_SHOWCASE":
            return <CategoryGrid key={idx} categories={data.featuredCategories} />;
          case "PRODUCT_SHOWCASE":
            return (
              <ProductGrid
                key={idx}
                products={data.featuredProducts}
                title="Produtos em Destaque"
                subtitle="Confira os materiais mais solicitados por nossos clientes com acabamento premium"
              />
            );
          case "TESTIMONIAL":
            return <TestimonialSection key={idx} testimonials={data.testimonials} />;
          case "CTA":
            return <CtaSection key={idx} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

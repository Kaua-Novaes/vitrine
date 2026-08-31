"use client";

import React, { useState, useEffect } from "react";
import { BannerResponse } from "@/types/api";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerSliderProps {
  banners: BannerResponse[];
}

export const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 shadow-md">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => {
          const content = (
            <div className="relative w-full shrink-0">
              {/* Picture tag for responsive desktop vs mobile image */}
              <picture>
                <source media="(max-width: 768px)" srcSet={banner.mobileImageUrl} />
                <source media="(min-width: 769px)" srcSet={banner.desktopImageUrl} />
                <img
                  src={banner.desktopImageUrl}
                  alt={banner.title}
                  className="w-full h-[400px] sm:h-[480px] lg:h-[550px] object-cover object-center brightness-95"
                />
              </picture>

              {/* Title & Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-6 sm:p-12 lg:p-16">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                    {banner.title}
                  </h2>
                </div>
              </div>
            </div>
          );

          return banner.linkUrl ? (
            <Link key={banner.id} href={banner.linkUrl} className="w-full shrink-0 block">
              {content}
            </Link>
          ) : (
            <div key={banner.id} className="w-full shrink-0">
              {content}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all focus:outline-none"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all focus:outline-none"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all ${
                  current === i ? "w-8 bg-blue-500" : "w-2.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

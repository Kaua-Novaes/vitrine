import React from "react";
import Link from "next/link";
import { ProductSummaryResponse } from "@/types/api";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "lucide-react";

export { ProductCard };

export const ProductGrid: React.FC<{
  products: ProductSummaryResponse[];
  title?: string;
  subtitle?: string;
}> = ({ products, title = "Produtos em Destaque", subtitle }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Nossa Seleção
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-xl">{subtitle}</p>}
          </div>
          <Link
            href="/produtos"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Ver catálogo completo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};

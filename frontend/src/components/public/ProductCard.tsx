import React from "react";
import Link from "next/link";
import { ProductSummaryResponse } from "@/types/api";
import { Sparkles, Image as ImageIcon, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: ProductSummaryResponse;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        {product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}

        {product.featured && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-sm tracking-wide">
            <Sparkles className="h-3 w-3" />
            Destaque
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-600 group-hover:underline">
            Ver detalhes e orçamento
          </span>
          <div className="p-1.5 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductService } from "@/services/product.service";
import { StoreService } from "@/services/store.service";
import { ProductDetailResponse, StorePublicResponse } from "@/types/api";
import { ProductCard } from "@/components/public/ProductCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  MessageCircle,
  ChevronLeft,
  Share2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [store, setStore] = useState<StorePublicResponse | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    StoreService.getPublicInfo().then(setStore).catch(console.error);
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setSelectedImageIndex(0);

    ProductService.getProductBySlug(slug)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error("Erro ao carregar detalhes do produto:", err);
        setError("Produto não encontrado ou indisponível.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingState message="Carregando detalhes do produto..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4">
        <ErrorState
          title="Produto não encontrado"
          message={error || "O produto solicitado não existe ou foi desativado."}
        />
        <div className="text-center mt-6">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const phone = store?.whatsappNumber?.replace(/\D/g, "") || "";
  const whatsappMessage = store?.whatsappMessageTemplate
    ? store.whatsappMessageTemplate.replace("{product_name}", product.name)
    : `Olá! Tenho interesse no produto *${product.name}* e gostaria de solicitar um orçamento personalizado.`;

  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  const images = product.images || [];
  const currentImage = images[selectedImageIndex]?.imageUrl || images[0]?.imageUrl;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-8 overflow-x-auto">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link href="/produtos" className="hover:text-blue-600 transition-colors">
          Produtos
        </Link>
        {product.categories?.[0] && (
          <>
            <span>/</span>
            <Link
              href={`/produtos?categoria=${product.categories[0].slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {product.categories[0].name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Gallery (Left: 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Photo View */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-md">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                Sem foto
              </div>
            )}

            {product.featured && (
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md">
                <Sparkles className="h-3.5 w-3.5" />
                Destaque
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={img.id || i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === i
                      ? "border-blue-600 shadow-md scale-95"
                      : "border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
                  }`}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <img
                    src={img.imageUrl}
                    alt={`${product.name} miniatura ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details (Right: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category Badges */}
            <div className="flex flex-wrap gap-2">
              {product.categories?.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {product.shortDescription}
              </p>
            )}

            {/* Quick Benefits */}
            <div className="py-4 border-y border-slate-200/80 space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Personalização completa com a identidade da sua marca</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Impressão em alta definição e acabamentos nobres</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Atendimento consultivo e suporte no fechamento do arquivo</span>
              </div>
            </div>

            {/* WhatsApp Quote Action */}
            <div className="pt-2 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5 fill-white" />
                Pedir Orçamento no WhatsApp
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                {copied
                  ? "Link copiado para a área de transferência!"
                  : "Compartilhar este produto"}
              </button>
            </div>
          </div>

          {/* Description Section */}
          {product.description && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">
                Descrição & Especificações
              </h3>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/70 p-5 rounded-2xl border border-slate-200/60">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-slate-200">
          <div className="mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Veja Também
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Produtos Relacionados
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

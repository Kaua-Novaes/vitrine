"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { ProductSummaryResponse, CategoryResponse } from "@/types/api";
import { ProductCard } from "@/components/public/ProductCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("categoria") || "";

  const [products, setProducts] = useState<ProductSummaryResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  // Carregar categorias
  useEffect(() => {
    CategoryService.getPublicCategories().then(setCategories).catch(console.error);
  }, []);

  // Sincronizar com query params
  useEffect(() => {
    setSearchTerm(queryParam);
    setSelectedCategory(categoryParam);
  }, [queryParam, categoryParam]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ProductService.getPublicProducts(
        queryParam || undefined,
        categoryParam || undefined,
        page,
        20
      );
      setProducts(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError("Não foi possível carregar os produtos no momento.");
    } finally {
      setLoading(false);
    }
  }, [queryParam, categoryParam, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const applyFilters = (newCategory?: string, newQuery?: string) => {
    const params = new URLSearchParams();
    const q = newQuery !== undefined ? newQuery : searchTerm;
    const cat = newCategory !== undefined ? newCategory : selectedCategory;

    if (q.trim()) params.set("q", q.trim());
    if (cat) params.set("categoria", cat);

    setPage(0);
    router.push(`/produtos?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(undefined, searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPage(0);
    router.push("/produtos");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Catálogo de Produtos
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore nossos materiais gráficos de alta performance e acabamento profissional.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="search"
            placeholder="Buscar por nome ou características..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="h-3.5 w-3.5" />
            Filtros:
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("");
              applyFilters("", undefined);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              !selectedCategory
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos ({totalElements})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                const next = selectedCategory === cat.slug ? "" : cat.slug;
                setSelectedCategory(next);
                applyFilters(next, undefined);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}

          {(searchTerm || selectedCategory) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors shrink-0"
            >
              <X className="h-3 w-3" />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Main Content States */}
      {loading ? (
        <div className="py-20">
          <LoadingState message="Buscando produtos no catálogo..." />
        </div>
      ) : error ? (
        <div className="py-12 max-w-lg mx-auto">
          <ErrorState message={error} onRetry={loadProducts} />
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 max-w-md mx-auto">
          <EmptyState
            title="Nenhum produto encontrado"
            message="Tente ajustar sua busca ou selecionar outra categoria para ver mais resultados."
            actionLabel="Ver todos os produtos"
            onAction={clearFilters}
          />
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-xs font-bold text-slate-600">
                Página {page + 1} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Próxima página"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<LoadingState message="Carregando catálogo..." />}>
      <CatalogContent />
    </Suspense>
  );
}

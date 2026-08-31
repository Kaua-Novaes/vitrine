"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StoreService } from "@/services/store.service";
import { CategoryService } from "@/services/category.service";
import { StorePublicResponse, CategoryResponse } from "@/types/api";
import { Search, Menu, X, MessageCircle, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export const Navbar: React.FC = () => {
  const [store, setStore] = useState<StorePublicResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    StoreService.getPublicInfo().then(setStore).catch(console.error);
    CategoryService.getPublicCategories().then(setCategories).catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const whatsappUrl = store?.whatsappNumber
    ? `https://wa.me/${store.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Olá! Gostaria de tirar dúvidas sobre os produtos da vitrine."
      )}`
    : "#";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Store Name */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {store?.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name || "Logo"}
                className="h-10 w-auto max-w-[140px] object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                {store?.name?.charAt(0) || "V"}
              </div>
            )}
            <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
              {store?.name || "Vitrine Digital"}
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="search"
              placeholder="Buscar produtos, cartões, banners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </form>

          {/* Desktop Nav Links & WhatsApp Action */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              Início
            </Link>
            <Link
              href="/produtos"
              className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4 text-slate-400" />
              Catálogo
            </Link>

            {/* WhatsApp CTA */}
            {store?.whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                Orçamento WhatsApp
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {store?.whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-emerald-600 bg-emerald-50 rounded-full hover:bg-emerald-100"
                aria-label="Falar no WhatsApp"
              >
                <MessageCircle className="h-5 w-5 fill-emerald-600" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Categories horizontal sub-nav (Desktop) */}
        {categories.length > 0 && (
          <div className="hidden md:flex items-center gap-6 py-2.5 border-t border-slate-100 text-xs font-medium text-slate-600 overflow-x-auto scrollbar-none">
            <span className="text-slate-400 uppercase tracking-wider text-[11px] font-bold shrink-0">
              Categorias:
            </span>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/produtos?categoria=${cat.slug}`}
                className="whitespace-nowrap hover:text-blue-600 hover:underline decoration-2 underline-offset-4 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-900"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </form>

          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
            >
              Início
            </Link>
            <Link
              href="/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-semibold text-slate-800 rounded-lg hover:bg-slate-50"
            >
              Todos os Produtos
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <span className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Categorias
              </span>
              <div className="mt-1 space-y-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/produtos?categoria=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-1.5 text-sm text-slate-600 hover:text-blue-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

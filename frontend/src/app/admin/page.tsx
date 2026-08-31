"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { BannerService } from "@/services/banner.service";
import { TestimonialService } from "@/services/testimonial.service";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  Package,
  Layers,
  Image as ImageIcon,
  MessageSquareQuote,
  ArrowUpRight,
  Plus,
  ShoppingBag,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    banners: 0,
    testimonials: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [prodRes, catRes, banRes, testRes] = await Promise.all([
          ProductService.getAdminProducts(0, 100),
          CategoryService.getAdminCategories(),
          BannerService.getAdminBanners(),
          TestimonialService.getAdminTestimonials(),
        ]);

        setStats({
          products: prodRes.totalElements,
          categories: catRes.length,
          banners: banRes.length,
          testimonials: testRes.length,
        });
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingState message="Carregando dados do painel..." className="py-24" />;
  }

  const statCards = [
    {
      title: "Total de Produtos",
      value: stats.products,
      icon: Package,
      href: "/admin/produtos",
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Categorias Ativas",
      value: stats.categories,
      icon: Layers,
      href: "/admin/categorias",
      color: "from-purple-600 to-pink-600",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Banners Cadastrados",
      value: stats.banners,
      icon: ImageIcon,
      href: "/admin/banners",
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Depoimentos",
      value: stats.testimonials,
      icon: MessageSquareQuote,
      href: "/admin/depoimentos",
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Visão Geral
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Métricas e atalhos rápidos para gestão dos conteúdos da vitrine.
          </p>
        </div>

        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-700 transition-colors" />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{card.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Ações Rápidas de Administração</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/produtos"
            className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30 transition-all flex items-center gap-3"
          >
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-bold text-slate-800">Gerenciar Produtos</p>
              <p className="text-[11px] text-slate-500">Criar, editar e ordenar catálogo</p>
            </div>
          </Link>

          <Link
            href="/admin/banners"
            className="p-4 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50/50 hover:bg-purple-50/30 transition-all flex items-center gap-3"
          >
            <ImageIcon className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-bold text-slate-800">Banners Promocionais</p>
              <p className="text-[11px] text-slate-500">Atualizar slides desktop e mobile</p>
            </div>
          </Link>

          <Link
            href="/admin/configuracoes"
            className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 transition-all flex items-center gap-3"
          >
            <Package className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-sm font-bold text-slate-800">Identidade Visual</p>
              <p className="text-[11px] text-slate-500">Logo, cores e WhatsApp da loja</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

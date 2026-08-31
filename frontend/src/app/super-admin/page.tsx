"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SuperAdminService } from "@/services/super-admin.service";
import { SuperAdminMetricsResponse, TenantSummaryResponse } from "@/types/api";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  Store,
  Package,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SuperAdminMetricsResponse | null>(null);
  const [tenants, setTenants] = useState<TenantSummaryResponse[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [m, t] = await Promise.all([
          SuperAdminService.getMetrics(),
          SuperAdminService.getTenants(),
        ]);
        setMetrics(m);
        setTenants(t);
      } catch (err) {
        console.error("Erro ao carregar dados do Super Admin:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="py-24">
        <LoadingState message="Carregando métricas da plataforma..." />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Lojas Criadas",
      value: metrics.totalTenants,
      sub: "Tenants cadastrados",
      icon: Store,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Lojas Ativas",
      value: metrics.activeTenants,
      sub: `${Math.round((metrics.activeTenants / metrics.totalTenants) * 100)}% de taxa de atividade`,
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Produtos Cadastrados",
      value: metrics.totalProducts,
      sub: "Total em todas as vitrines",
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Crescimento Mensal",
      value: metrics.monthlyGrowthRate,
      sub: "Novos tenants no mês",
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Painel do Proprietário da Plataforma
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visão consolidada de todas as lojas, tenants e infraestrutura SaaS.
          </p>
        </div>

        <Link
          href="/super-admin/lojas"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          Provisionar Nova Loja
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-6 rounded-2xl border ${card.bg} bg-slate-900/60 backdrop-blur-xs flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl bg-slate-950 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-white">{card.value}</p>
                <p className="text-[11px] text-slate-400 mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Stores Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Lojas Cadastradas Recentemente</h2>
            <p className="text-xs text-slate-400">
              Visão rápida dos tenants provisionados na plataforma
            </p>
          </div>
          <Link
            href="/super-admin/lojas"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            <span>Ver todas as lojas</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Loja (Tenant)</th>
                <th className="py-3 px-4">Proprietário</th>
                <th className="py-3 px-4 text-center">Produtos</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Acesso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400 font-mono">slug: {t.slug}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-200 font-medium">{t.ownerName}</p>
                    <p className="text-xs text-slate-400">{t.ownerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-300">
                    {t.productCount}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        t.active
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {t.active ? "Ativa" : "Suspensa"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      href="/"
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                      title="Ver vitrine pública"
                    >
                      <span>Vitrine</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-bold transition-all border border-amber-500/30"
                      title="Entrar no painel da loja"
                    >
                      <span>Entrar no Painel</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Store, ArrowLeft, Menu, X, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { href: "/super-admin", label: "Visão Geral SaaS", icon: LayoutDashboard },
  { href: "/super-admin/lojas", label: "Gerenciar Lojas (Tenants)", icon: Store },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950 font-black text-xs">
            SAAS
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">Super Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between p-5 transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Header Brand */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-slate-950 shadow-md">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-white text-base tracking-tight">Super Admin</h2>
                <span className="px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-400 text-[10px] font-extrabold border border-amber-500/30">
                  ROOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Controle da Plataforma</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 pt-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Modo Plataforma</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Você tem controle total sobre o provisionamento e o status de todos os tenants.
            </p>
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Admin da Loja</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">{children}</main>
    </div>
  );
}

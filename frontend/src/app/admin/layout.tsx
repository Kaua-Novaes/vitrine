"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { UserResponse } from "@/types/api";
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  MessageSquareQuote,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: Layers },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    if (!AuthService.isAuthenticated()) {
      router.push("/admin/login");
      return;
    }

    AuthService.getCurrentUser()
      .then(setUser)
      .catch(() => {
        AuthService.logout();
        router.push("/admin/login");
      });
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  const handleLogout = () => {
    AuthService.logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="font-bold text-sm tracking-tight">Painel Master</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">Painel Master</h2>
              <span className="text-[11px] text-slate-400">Gestão da Vitrine</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer & User Profile */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span>Ver Vitrine Pública</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <div className="px-3 py-2 bg-slate-950/60 rounded-xl flex items-center justify-between">
            <div className="truncate mr-2">
              <p className="text-xs font-bold text-white truncate">
                {user?.name || "Administrador"}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || "admin@vitrine.com"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800"
              title="Encerrar sessão"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">{children}</main>
    </div>
  );
}

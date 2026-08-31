"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SuperAdminService } from "@/services/super-admin.service";
import { TenantSummaryResponse, CreateTenantRequest } from "@/types/api";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Plus,
  Search,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Power,
  ArrowRight,
} from "lucide-react";

export default function SuperAdminTenantsPage() {
  const [tenants, setTenants] = useState<TenantSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: "",
    slug: "",
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "password123",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await SuperAdminService.getTenants();
      setTenants(res);
    } catch (err) {
      console.error("Erro ao carregar tenants:", err);
      setError("Não foi possível carregar as lojas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ownerEmail.trim()) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setSaving(true);
      const cleanedSlug =
        formData.slug.trim() ||
        formData.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-");

      await SuperAdminService.createTenant({
        ...formData,
        slug: cleanedSlug,
      });

      setModalOpen(false);
      setFormData({
        name: "",
        slug: "",
        ownerName: "",
        ownerEmail: "",
        ownerPassword: "password123",
      });
      loadData();
    } catch (err) {
      console.error("Erro ao criar loja:", err);
      alert("Erro ao provisionar loja.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (tenant: TenantSummaryResponse) => {
    const action = tenant.active ? "suspender" : "ativar";
    if (!confirm(`Deseja realmente ${action} a loja "${tenant.name}"?`)) return;

    try {
      await SuperAdminService.toggleTenantStatus(tenant.id, !tenant.active);
      loadData();
    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Não foi possível alterar o status da loja.");
    }
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gerenciamento de Lojas (Tenants)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Provisione novas vitrines, controle o status das contas e acesse os painéis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          Provisionar Nova Loja
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="search"
          placeholder="Buscar por nome da loja, slug ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs placeholder:text-slate-500"
        />
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
      </div>

      {/* Tenants Table */}
      {loading ? (
        <div className="py-20">
          <LoadingState message="Carregando lista de lojas..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filteredTenants.length === 0 ? (
        <EmptyState
          title="Nenhuma loja encontrada"
          message="Provisione uma nova loja clicando no botão acima."
          actionLabel="Provisionar Loja"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Loja / Subdomínio</th>
                  <th className="py-3.5 px-4">Proprietário</th>
                  <th className="py-3.5 px-4 text-center">Produtos</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-bold text-white text-base">{t.name}</p>
                      <p className="text-xs text-amber-400 font-mono mt-0.5">
                        {t.slug}.vitrine.com.br
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-slate-200">{t.ownerName}</p>
                      <p className="text-xs text-slate-400">{t.ownerEmail}</p>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-300">
                      {t.productCount} itens
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          t.active
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {t.active ? (
                          <>
                            <ShieldCheck className="h-3 w-3" /> Ativa
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="h-3 w-3" /> Suspensa
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(t)}
                        className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                          t.active
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-emerald-400 hover:bg-emerald-500/10"
                        }`}
                        title={t.active ? "Suspender Loja" : "Ativar Loja"}
                      >
                        <Power className="h-4 w-4" />
                      </button>

                      <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Ver vitrine pública"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>

                      <Link
                        href="/admin"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-bold transition-all border border-amber-500/30"
                        title="Entrar no painel da loja"
                      >
                        <span>Entrar no Painel</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Provisionar Loja */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-black text-white">Provisionar Nova Loja (Tenant)</h2>
                <p className="text-xs text-slate-400">
                  Crie a conta da loja e o usuário administrador inicial
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nome da Loja / Gráfica *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Gráfica Nova Era"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Slug do Subdomínio
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Ex: grafica-nova-era (auto-gerado se vazio)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nome do Proprietário *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Ex: Fernando Souza"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    E-mail de Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="contato@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Provisionando..." : "Provisionar Loja"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

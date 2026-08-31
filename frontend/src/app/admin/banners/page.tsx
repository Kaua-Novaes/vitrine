"use client";

import React, { useState, useEffect } from "react";
import { BannerService } from "@/services/banner.service";
import { BannerResponse, BannerInput } from "@/types/api";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<BannerInput>({
    title: "",
    desktopImageUrl: "",
    mobileImageUrl: "",
    linkUrl: "",
    active: true,
    displayOrder: 1,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await BannerService.getAdminBanners();
      setBanners(res);
    } catch (err) {
      console.error("Erro ao carregar banners:", err);
      setError("Não foi possível carregar os banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      desktopImageUrl: "",
      mobileImageUrl: "",
      linkUrl: "",
      active: true,
      displayOrder: banners.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (b: BannerResponse) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      desktopImageUrl: b.desktopImageUrl,
      mobileImageUrl: b.mobileImageUrl,
      linkUrl: b.linkUrl || "",
      active: b.active,
      displayOrder: b.displayOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.desktopImageUrl || !formData.mobileImageUrl) {
      alert("Por favor, preencha o título e faça upload das imagens desktop e mobile.");
      return;
    }

    try {
      setSaving(true);
      if (editingBanner) {
        await BannerService.updateBanner(editingBanner.id, formData);
      } else {
        await BannerService.createBanner(formData);
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro ao salvar banner:", err);
      alert("Erro ao salvar banner.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return;
    try {
      await BannerService.deleteBanner(id);
      loadData();
    } catch (err) {
      console.error("Erro ao excluir banner:", err);
      alert("Não foi possível excluir o banner.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Banners Promocionais
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure os destaques da vitrine para dispositivos desktop e mobile.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          Novo Banner
        </button>
      </div>

      {loading ? (
        <LoadingState message="Carregando banners..." className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : banners.length === 0 ? (
        <EmptyState
          title="Nenhum banner cadastrado"
          message="Cadastre o primeiro banner para ilustrar o topo da sua vitrine."
          actionLabel="Cadastrar Banner"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={b.desktopImageUrl}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-bold backdrop-blur-xs">
                    Ordem: #{b.displayOrder}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        b.active
                          ? "bg-emerald-500 text-white shadow-xs"
                          : "bg-red-500 text-white shadow-xs"
                      }`}
                    >
                      {b.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-base text-slate-900">{b.title}</h3>
                  {b.linkUrl && (
                    <p className="text-xs text-blue-600 font-medium mt-1 truncate">
                      Link: {b.linkUrl}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(b)}
                  className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                  title="Editar banner"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 text-slate-600 hover:text-red-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                  title="Excluir banner"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Banner */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingBanner ? "Editar Banner" : "Novo Banner"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título do Banner *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Impressão em Alta Definição"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Link de Redirecionamento (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.linkUrl || ""}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="Ex: /produtos/cartoes-de-visita"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUpload
                  value={formData.desktopImageUrl}
                  onChange={(desktopImageUrl) => setFormData({ ...formData, desktopImageUrl })}
                  folder="banners"
                  label="Desktop (1920x600 - 3.2:1)"
                />

                <ImageUpload
                  value={formData.mobileImageUrl}
                  onChange={(mobileImageUrl) => setFormData({ ...formData, mobileImageUrl })}
                  folder="banners"
                  label="Mobile (1080x1350 - 4:5)"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-slate-800">Banner ativo</span>
                </label>

                <div>
                  <label className="text-xs font-bold text-slate-700 mr-2">Ordem:</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.displayOrder || 1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  {saving ? "Salvando..." : "Salvar Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

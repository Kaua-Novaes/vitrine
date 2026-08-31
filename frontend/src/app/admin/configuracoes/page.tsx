"use client";

import React, { useState, useEffect } from "react";
import { StoreService } from "@/services/store.service";
import { StoreSettingsResponse, UpdateStoreSettingsRequest } from "@/types/api";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Save, CheckCircle2, Store, MessageCircle, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<UpdateStoreSettingsRequest>({
    storeName: "",
    logoUrl: "",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    backgroundColor: "#f8fafc",
    textColor: "#0f172a",
    whatsappNumber: "",
    whatsappMessageTemplate: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await StoreService.getAdminSettings();
      setSettings(res);
      setFormData({
        storeName: res.storeName || "",
        logoUrl: res.logoUrl || "",
        primaryColor: res.primaryColor || "#2563eb",
        secondaryColor: res.secondaryColor || "#1e40af",
        backgroundColor: res.backgroundColor || "#f8fafc",
        textColor: res.textColor || "#0f172a",
        whatsappNumber: res.whatsappNumber || "",
        whatsappMessageTemplate: res.whatsappMessageTemplate || "",
      });
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
      setError("Não foi possível carregar as configurações da loja.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccess(false);
      await StoreService.updateAdminSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Erro ao atualizar configurações:", err);
      alert("Erro ao salvar configurações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Carregando configurações..." className="py-20" />;
  }

  if (error || !settings) {
    return <ErrorState message={error || "Erro"} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Configurações da Loja
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Personalize a identidade visual, dados de contato e WhatsApp da vitrine.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Configurações atualizadas com sucesso!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identidade da Loja */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <Store className="h-5 w-5 text-blue-600" />
            <h3>Identidade da Vitrine</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nome da Loja / Gráfica *
              </label>
              <input
                type="text"
                required
                value={formData.storeName || ""}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="Ex: Gráfica Modelo"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Slug (Subdomínio)
              </label>
              <input
                type="text"
                disabled
                value={settings.slug}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <ImageUpload
            value={formData.logoUrl}
            onChange={(logoUrl) => setFormData({ ...formData, logoUrl })}
            folder="logo"
            label="Logotipo da Loja (PNG, SVG ou WebP)"
          />
        </div>

        {/* Cores */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <Palette className="h-5 w-5 text-purple-600" />
            <h3>Paleta de Cores da Marca</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Cor Primária</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor || "#2563eb"}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-10 w-12 rounded-lg cursor-pointer border border-slate-200 p-1"
                />
                <span className="text-xs font-mono text-slate-600 uppercase">
                  {formData.primaryColor}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cor Secundária
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondaryColor || "#1e40af"}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-10 w-12 rounded-lg cursor-pointer border border-slate-200 p-1"
                />
                <span className="text-xs font-mono text-slate-600 uppercase">
                  {formData.secondaryColor}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Fundo do Site</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.backgroundColor || "#f8fafc"}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="h-10 w-12 rounded-lg cursor-pointer border border-slate-200 p-1"
                />
                <span className="text-xs font-mono text-slate-600 uppercase">
                  {formData.backgroundColor}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Cor do Texto</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.textColor || "#0f172a"}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="h-10 w-12 rounded-lg cursor-pointer border border-slate-200 p-1"
                />
                <span className="text-xs font-mono text-slate-600 uppercase">
                  {formData.textColor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Integração WhatsApp */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            <MessageCircle className="h-5 w-5 text-emerald-600" />
            <h3>Atendimento & Orçamento WhatsApp</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Número do WhatsApp (com DDD) *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber || ""}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="Ex: 5511999998888"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Insira o código do país (55 para Brasil) + DDD + número sem espaços.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Template da Mensagem Padrão
              </label>
              <textarea
                rows={3}
                value={formData.whatsappMessageTemplate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsappMessageTemplate: e.target.value,
                  })
                }
                placeholder="Olá! Tenho interesse no produto {product_name}..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Use a tag <code className="font-bold text-blue-600">&#123;product_name&#125;</code>{" "}
                para preencher automaticamente o nome do produto.
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Salvando Alterações..." : "Salvar Configurações"}
          </button>
        </div>
      </form>
    </div>
  );
}

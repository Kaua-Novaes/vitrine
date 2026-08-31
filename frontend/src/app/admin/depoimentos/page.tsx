"use client";

import React, { useState, useEffect } from "react";
import { TestimonialService } from "@/services/testimonial.service";
import { TestimonialResponse, TestimonialInput } from "@/types/api";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Edit2, Trash2, Check, X, Quote, Star } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<TestimonialInput>({
    name: "",
    text: "",
    active: true,
    displayOrder: 1,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await TestimonialService.getAdminTestimonials();
      setTestimonials(res);
    } catch (err) {
      console.error("Erro ao carregar depoimentos:", err);
      setError("Não foi possível carregar os depoimentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      name: "",
      text: "",
      active: true,
      displayOrder: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (t: TestimonialResponse) => {
    setEditingTestimonial(t);
    setFormData({
      name: t.name,
      text: t.text,
      active: t.active,
      displayOrder: t.displayOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) {
      alert("Por favor, preencha o nome e o depoimento.");
      return;
    }

    try {
      setSaving(true);
      if (editingTestimonial) {
        await TestimonialService.updateTestimonial(editingTestimonial.id, formData);
      } else {
        await TestimonialService.createTestimonial(formData);
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro ao salvar depoimento:", err);
      alert("Erro ao salvar depoimento.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    try {
      await TestimonialService.deleteTestimonial(id);
      loadData();
    } catch (err) {
      console.error("Erro ao excluir depoimento:", err);
      alert("Não foi possível excluir o depoimento.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Depoimentos de Clientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gerencie as avaliações que geram prova social na Home.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          Novo Depoimento
        </button>
      </div>

      {loading ? (
        <LoadingState message="Carregando depoimentos..." className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : testimonials.length === 0 ? (
        <EmptyState
          title="Nenhum depoimento cadastrado"
          message="Cadastre depoimentos de clientes satisfeitos para exibir na vitrine."
          actionLabel="Cadastrar Depoimento"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      t.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}
                  >
                    {t.active ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <Quote className="h-6 w-6 text-slate-300 mb-2" />
                <p className="text-sm text-slate-700 italic leading-relaxed">"{t.text}"</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{t.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(t)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Editar depoimento"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-slate-600 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Excluir depoimento"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Depoimento */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingTestimonial ? "Editar Depoimento" : "Novo Depoimento"}
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
                  Nome do Cliente / Empresa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Carlos Eduardo — Startup Soluções"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Texto do Depoimento *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Excelente atendimento, qualidade impecável e entrega rápida..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
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
                  <span className="text-xs font-semibold text-slate-800">Depoimento ativo</span>
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
                  {saving ? "Salvando..." : "Salvar Depoimento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

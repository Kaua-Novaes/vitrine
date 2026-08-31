"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ProductService } from "@/services/product.service";
import { CategoryService } from "@/services/category.service";
import { ProductDetailResponse, CategoryResponse, ProductInput } from "@/types/api";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Edit2, Trash2, Search, Sparkles, Check, X, PlusCircle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDetailResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetailResponse | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<ProductInput>({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    featured: false,
    active: true,
    categoryIds: [],
    imageUrls: [""],
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodPage, cats] = await Promise.all([
        ProductService.getAdminProducts(0, 50, search || undefined),
        CategoryService.getAdminCategories(),
      ]);
      // Buscar detalhes de cada produto para ter todas imagens/categorias
      const detailed = await Promise.all(
        prodPage.content.map((p) => ProductService.getAdminProductById(p.id))
      );
      setProducts(detailed);
      setCategories(cats);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError("Não foi possível carregar a lista de produtos.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      featured: false,
      active: true,
      categoryIds: categories[0] ? [categories[0].id] : [],
      imageUrls: [""],
    });
    setModalOpen(true);
  };

  const openEditModal = (product: ProductDetailResponse) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription || "",
      description: product.description || "",
      featured: product.featured,
      active: product.active,
      categoryIds: product.categories.map((c) => c.id),
      imageUrls: product.images.map((img) => img.imageUrl),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      const cleanedData: ProductInput = {
        ...formData,
        slug:
          formData.slug.trim() ||
          formData.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-"),
        imageUrls: (formData.imageUrls || []).filter((url) => Boolean(url.trim())),
      };

      if (editingProduct) {
        await ProductService.updateProduct(editingProduct.id, cleanedData);
      } else {
        await ProductService.createProduct(cleanedData);
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Erro ao salvar produto. Verifique os campos.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await ProductService.deleteProduct(id);
      loadData();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      alert("Não foi possível excluir o produto.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gerenciamento de Produtos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cadastre, edite e organize os produtos da vitrine.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all self-start"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="search"
          placeholder="Buscar produto por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
      </div>

      {/* Products Table / List */}
      {loading ? (
        <LoadingState message="Carregando catálogo de produtos..." className="py-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : products.length === 0 ? (
        <EmptyState
          title="Nenhum produto cadastrado"
          message="Clique no botão acima para adicionar o seu primeiro produto."
          actionLabel="Cadastrar Produto"
          onAction={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Foto</th>
                  <th className="py-3.5 px-4">Nome</th>
                  <th className="py-3.5 px-4">Categorias</th>
                  <th className="py-3.5 px-4 text-center">Destaque</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        {prod.images?.[0]?.imageUrl ? (
                          <img
                            src={prod.images[0].imageUrl}
                            alt={prod.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                            Sem foto
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">/{prod.slug}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.categories?.map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {prod.featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                          <Sparkles className="h-3 w-3" /> Sim
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Não</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          prod.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}
                      >
                        {prod.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Editar produto"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 text-slate-600 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Nome & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Cartão Couchê 300g"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Slug (URL amigável)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-gerado se vazio"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Categorias */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Categorias
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const isSelected = formData.categoryIds?.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          const current = formData.categoryIds || [];
                          const updated = isSelected
                            ? current.filter((id) => id !== c.id)
                            : [...current, c.id];
                          setFormData({ ...formData, categoryIds: updated });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descrição Curta (Resumo para o card)
                </label>
                <input
                  type="text"
                  value={formData.shortDescription || ""}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Ex: Papel Couchê 300g com Laminação Fosca."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Descrição Detalhada & Especificações
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes, especificações técnicas, prazos e opções..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Upload de Imagens */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Galeria de Imagens
                </label>
                <div className="space-y-3">
                  {(formData.imageUrls || []).map((url, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <ImageUpload
                          value={url}
                          onChange={(newUrl) => {
                            const copy = [...(formData.imageUrls || [])];
                            copy[idx] = newUrl;
                            setFormData({ ...formData, imageUrls: copy });
                          }}
                          folder="products"
                          label={`Foto ${idx + 1}`}
                        />
                      </div>
                      {formData.imageUrls && formData.imageUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const copy = formData.imageUrls?.filter((_, i) => i !== idx);
                            setFormData({ ...formData, imageUrls: copy });
                          }}
                          className="p-2 text-red-500 hover:text-red-700 mt-5"
                          title="Remover foto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        imageUrls: [...(formData.imageUrls || []), ""],
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Adicionar outra foto
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-slate-800">Produto em Destaque</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-slate-800">Ativo na vitrine</span>
                </label>
              </div>

              {/* Actions */}
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
                  {saving ? "Salvando..." : "Salvar Produto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

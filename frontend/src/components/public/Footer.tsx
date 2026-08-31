"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StoreService } from "@/services/store.service";
import { CategoryService } from "@/services/category.service";
import { StorePublicResponse, CategoryResponse } from "@/types/api";
import { MessageCircle, ShieldCheck, Clock, ArrowRight } from "lucide-react";

export const Footer: React.FC = () => {
  const [store, setStore] = useState<StorePublicResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    StoreService.getPublicInfo().then(setStore).catch(console.error);
    CategoryService.getPublicCategories().then(setCategories).catch(console.error);
  }, []);

  const whatsappUrl = store?.whatsappNumber
    ? `https://wa.me/${store.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Olá! Gostaria de mais informações sobre seus serviços."
      )}`
    : "#";

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Highlights Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-900/30 text-blue-400 border border-blue-800/50">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Qualidade Garantida</h4>
              <p className="text-xs text-slate-400">
                Impressões em alta definição com materiais premium
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Atendimento Rápido</h4>
              <p className="text-xs text-slate-400">Orçamentos e suporte direto pelo WhatsApp</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-900/30 text-amber-400 border border-amber-800/50">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Pontualidade no Prazo</h4>
              <p className="text-xs text-slate-400">
                Compromisso com a entrega rápida de seus pedidos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            {store?.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name || "Logo"}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {store?.name?.charAt(0) || "V"}
              </div>
            )}
            <span className="font-bold text-lg text-white">{store?.name || "Vitrine Digital"}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sua vitrine gráfica e digital online. Conheça nossos produtos e solicite seu orçamento
            de forma rápida e prática.
          </p>
        </div>

        {/* Categories Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Categorias
          </h4>
          <ul className="space-y-2 text-xs">
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/produtos?categoria=${cat.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Navegação
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link href="/produtos" className="hover:text-white transition-colors">
                Catálogo Completo
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-blue-400 transition-colors text-slate-400">
                Acesso Administrativo
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
            Fale Conosco
          </h4>
          {store?.whatsappNumber && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4 fill-white" />
              Chamar no WhatsApp
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 text-center py-6 text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {store?.name || "Vitrine Digital"}. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};

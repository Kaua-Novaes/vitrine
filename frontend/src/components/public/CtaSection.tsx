"use client";

import React, { useState, useEffect } from "react";
import { StoreService } from "@/services/store.service";
import { StorePublicResponse } from "@/types/api";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";

export const CtaSection: React.FC = () => {
  const [store, setStore] = useState<StorePublicResponse | null>(null);

  useEffect(() => {
    StoreService.getPublicInfo().then(setStore).catch(console.error);
  }, []);

  if (!store?.whatsappNumber) return null;

  const whatsappUrl = `https://wa.me/${store.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Olá! Gostaria de um orçamento personalizado para materiais gráficos."
  )}`;

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm mb-6">
          <Sparkles className="h-4 w-4 text-amber-300" />
          Projetos Especiais & Orçamentos Sob Medida
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
          Precisa de um material exclusivo ou tiragem diferenciada?
        </h2>

        <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Nossa equipe de especialistas está pronta para analisar seu projeto e entregar o melhor
          resultado para sua marca.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5 text-emerald-600 fill-emerald-600" />
          Solicitar Orçamento no WhatsApp
          <ArrowRight className="h-4 w-4 text-slate-500" />
        </a>
      </div>
    </section>
  );
};

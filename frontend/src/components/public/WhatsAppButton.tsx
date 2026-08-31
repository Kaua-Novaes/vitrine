"use client";

import React, { useState, useEffect } from "react";
import { StoreService } from "@/services/store.service";
import { StorePublicResponse } from "@/types/api";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  productName?: string;
  customMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ productName, customMessage }) => {
  const [store, setStore] = useState<StorePublicResponse | null>(null);

  useEffect(() => {
    StoreService.getPublicInfo().then(setStore).catch(console.error);
  }, []);

  if (!store?.whatsappNumber) return null;

  const phone = store.whatsappNumber.replace(/\D/g, "");
  let message =
    customMessage ||
    (productName
      ? `Olá! Tenho interesse no produto *${productName}* e gostaria de solicitar um orçamento.`
      : "Olá! Gostaria de tirar dúvidas sobre os produtos da vitrine.");

  if (store.whatsappMessageTemplate && productName) {
    message = store.whatsappMessageTemplate.replace("{product_name}", productName);
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group focus:outline-none focus:ring-4 focus:ring-emerald-300"
      aria-label="Falar pelo WhatsApp"
    >
      <MessageCircle className="h-6 w-6 fill-white" />
      <span className="text-sm font-bold pr-1 hidden sm:inline-block">Falar no WhatsApp</span>
    </a>
  );
};

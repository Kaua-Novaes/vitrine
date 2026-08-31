"use client";

import React, { useState, useRef } from "react";
import { apiClient } from "@/lib/api/client";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder: "logo" | "banners" | "categories" | "products";
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder,
  label = "Imagem",
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);
      const res = await apiClient.admin.media.upload(file, folder);
      onChange(res.url);
    } catch (err: unknown) {
      console.error("Erro no upload:", err);
      setError("Falha no upload da imagem. Verifique o formato e tamanho.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-xs font-bold text-slate-700">{label}</label>}

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video max-h-48 flex items-center justify-center">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
            title="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-blue-50/30 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
              <span className="text-xs font-semibold text-slate-600">Enviando imagem...</span>
            </div>
          ) : (
            <>
              <div className="p-3 bg-white rounded-full shadow-xs mb-2 text-slate-400">
                <Upload className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-slate-700">
                Clique para selecionar ou arraste um arquivo
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, WebP ou SVG (máx. 5MB)
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
};

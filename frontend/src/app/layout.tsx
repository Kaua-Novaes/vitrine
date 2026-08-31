import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vitrine.com.br"),
  title: {
    default: "Vitrine Digital & Gráfica Express | Materiais Gráficos de Alto Impacto",
    template: "%s | Vitrine Digital",
  },
  description:
    "Confira nosso catálogo de produtos gráficos, cartões de visita, folders, banners e brindes com acabamento premium e solicite seu orçamento rápido pelo WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://vitrine.com.br",
    title: "Vitrine Digital & Gráfica Express",
    description: "Catálogo online completo de materiais gráficos e impressões personalizadas.",
    siteName: "Vitrine Digital",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitrine Digital & Gráfica Express",
    description: "Catálogo online de impressos e vitrine digital personalizada.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

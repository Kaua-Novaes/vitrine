import {
  StorePublicResponse,
  StoreSettingsResponse,
  BannerResponse,
  CategoryResponse,
  ProductSummaryResponse,
  ProductDetailResponse,
  TestimonialResponse,
  HomeSectionsResponse,
  UserResponse,
  TenantSummaryResponse,
  SuperAdminMetricsResponse,
} from "@/types/api";

export const mockTenantId = "7a26f584-7a13-43d9-9528-98e6d2bc3391";

export const mockStorePublic: StorePublicResponse = {
  id: mockTenantId,
  name: "Gráfica & Print Express",
  slug: "grafica-express",
  logoUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
  primaryColor: "#2563eb",
  secondaryColor: "#1e40af",
  backgroundColor: "#f8fafc",
  textColor: "#0f172a",
  whatsappNumber: "5511999998888",
  whatsappMessageTemplate:
    "Olá! Gostei muito do produto {product_name} no site. Poderia me enviar um orçamento?",
};

export const mockStoreSettings: StoreSettingsResponse = {
  id: mockTenantId,
  storeName: "Gráfica & Print Express",
  slug: "grafica-express",
  logoUrl:
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
  primaryColor: "#2563eb",
  secondaryColor: "#1e40af",
  backgroundColor: "#f8fafc",
  textColor: "#0f172a",
  whatsappNumber: "5511999998888",
  whatsappMessageTemplate:
    "Olá! Gostei muito do produto {product_name} no site. Poderia me enviar um orçamento?",
};

export const mockBanners: BannerResponse[] = [
  {
    id: "b0000001-0000-0000-0000-000000000001",
    title: "Materiais Gráficos de Alto Impacto para Sua Empresa",
    desktopImageUrl:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=600&auto=format&fit=crop&q=80",
    mobileImageUrl:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1080&h=1350&auto=format&fit=crop&q=80",
    linkUrl: "/produtos",
    displayOrder: 1,
    active: true,
  },
  {
    id: "b0000002-0000-0000-0000-000000000002",
    title: "Cartões de Visita Premium com Verniz Localizado",
    desktopImageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&h=600&auto=format&fit=crop&q=80",
    mobileImageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1080&h=1350&auto=format&fit=crop&q=80",
    linkUrl: "/produtos/cartoes-de-visita",
    displayOrder: 2,
    active: true,
  },
];

export const mockCategories: CategoryResponse[] = [
  {
    id: "c0000001-0000-0000-0000-000000000001",
    name: "Cartões de Visita",
    slug: "cartoes-de-visita",
    description: "Cartões couchê 300g, laminação fosca, verniz localizado e hot stamping.",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=800&auto=format&fit=crop&q=80",
    displayOrder: 1,
    active: true,
  },
  {
    id: "c0000002-0000-0000-0000-000000000002",
    name: "Folders e Flyers",
    slug: "folders-e-flyers",
    description: "Divulgação com acabamento impecável em diversos tamanhos e dobras.",
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&auto=format&fit=crop&q=80",
    displayOrder: 2,
    active: true,
  },
  {
    id: "c0000003-0000-0000-0000-000000000003",
    name: "Banners e Faixas",
    slug: "banners-e-faixas",
    description: "Lonas com impressão UV de alta durabilidade para eventos e fachadas.",
    imageUrl:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=800&auto=format&fit=crop&q=80",
    displayOrder: 3,
    active: true,
  },
  {
    id: "c0000004-0000-0000-0000-000000000004",
    name: "Adesivos e Rótulos",
    slug: "adesivos-e-rotulos",
    description: "Adesivos em vinil brilho, fosco, transparente e recorte eletrônico especial.",
    imageUrl:
      "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=800&h=800&auto=format&fit=crop&q=80",
    displayOrder: 4,
    active: true,
  },
];

export const mockProducts: ProductDetailResponse[] = [
  {
    id: "p0000001-0000-0000-0000-000000000001",
    name: "Cartão de Visita Couchê 300g com Verniz Localizado",
    slug: "cartao-de-visita-couche-300g-verniz-localizado",
    shortDescription: "Papel Couchê 300g, laminação fosca pro e verniz localizado frente e verso.",
    description: `Impressione seus clientes desde o primeiro contato. Nossos cartões com verniz localizado destacam a sua marca com elegância e sofisticação incomparável.

Especificações:
- Papel Couchê 300g encorpado
- Laminação Bopp Fosca
- Aplicação de Verniz UV Localizado
- Formato padrão 9x5cm
- Corte reto ou 4 cantos arredondados`,
    featured: true,
    displayOrder: 1,
    active: true,
    images: [
      {
        id: "img00001-0000-0000-0000-000000000001",
        imageUrl:
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1000&h=1000&auto=format&fit=crop&q=80",
        displayOrder: 1,
      },
      {
        id: "img00002-0000-0000-0000-000000000002",
        imageUrl:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&h=1000&auto=format&fit=crop&q=80",
        displayOrder: 2,
      },
    ],
    categories: [mockCategories[0]],
    relatedProducts: [],
  },
  {
    id: "p0000002-0000-0000-0000-000000000002",
    name: "Folder 3 Dobras Couchê 150g",
    slug: "folder-3-dobras-couche-150g",
    shortDescription:
      "Divulgue seus produtos e serviços com visual profissional e leitura agradável.",
    description: `O folder tríptico (3 dobras) oferece amplo espaço para apresentar detalhes da sua empresa, serviços, cases e informações de contato.

Especificações:
- Papel Couchê 150g Brilho ou Fosco
- Impressão 4x4 cores em alta definição
- Dobra tipo sanfona ou envelope
- Formato aberto A4 (21x29,7cm)`,
    featured: true,
    displayOrder: 2,
    active: true,
    images: [
      {
        id: "img00003-0000-0000-0000-000000000003",
        imageUrl:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1000&h=1000&auto=format&fit=crop&q=80",
        displayOrder: 1,
      },
    ],
    categories: [mockCategories[1]],
    relatedProducts: [],
  },
  {
    id: "p0000003-0000-0000-0000-000000000003",
    name: "Banner Roll-Up em Lona 440g",
    slug: "banner-roll-up-lona-440g",
    shortDescription: "Estrutura portátil em alumínio e impressão fotográfica de fácil transporte.",
    description: `Ideal para feiras, eventos corporativos, pontos de venda e recepções. Montagem em menos de 1 minuto com bolsa de transporte inclusa.`,
    featured: true,
    displayOrder: 3,
    active: true,
    images: [
      {
        id: "img00004-0000-0000-0000-000000000004",
        imageUrl:
          "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1000&h=1000&auto=format&fit=crop&q=80",
        displayOrder: 1,
      },
    ],
    categories: [mockCategories[2]],
    relatedProducts: [],
  },
  {
    id: "p0000004-0000-0000-0000-000000000004",
    name: "Rótulos em Vinil com Meio Corte Personalizado",
    slug: "rotulos-vinil-meio-corte",
    shortDescription: "Resistentes à umidade e refrigerador. Perfeito para embalagens e brindes.",
    description: `Adesivos e rótulos adesivos em vinil de alta aderência, resistentes a água e óleo, cortados no formato exato da sua marca.`,
    featured: true,
    displayOrder: 4,
    active: true,
    images: [
      {
        id: "img00005-0000-0000-0000-000000000005",
        imageUrl:
          "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=1000&h=1000&auto=format&fit=crop&q=80",
        displayOrder: 1,
      },
    ],
    categories: [mockCategories[3]],
    relatedProducts: [],
  },
];

export const mockProductSummaries: ProductSummaryResponse[] = mockProducts.map((p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  shortDescription: p.shortDescription,
  primaryImageUrl: p.images[0]?.imageUrl || null,
  featured: p.featured,
  displayOrder: p.displayOrder,
  active: p.active,
}));

// Preencher produtos relacionados
mockProducts[0].relatedProducts = [mockProductSummaries[1], mockProductSummaries[2]];
mockProducts[1].relatedProducts = [mockProductSummaries[0], mockProductSummaries[3]];
mockProducts[2].relatedProducts = [mockProductSummaries[0], mockProductSummaries[1]];
mockProducts[3].relatedProducts = [mockProductSummaries[0], mockProductSummaries[1]];

export const mockTestimonials: TestimonialResponse[] = [
  {
    id: "t0000001-0000-0000-0000-000000000001",
    name: "Carlos Eduardo — Startup Soluções",
    text: "Qualidade de impressão surpreendente! Nossos cartões e pastas institucionais causaram um impacto excelente em nossos investidores.",
    displayOrder: 1,
    active: true,
  },
  {
    id: "t0000002-0000-0000-0000-000000000002",
    name: "Mariana Alencar — Studio M Arquitetura",
    text: "Atendimento ágil pelo WhatsApp e entrega rigorosamente no prazo. Recomendo de olhos fechados!",
    displayOrder: 2,
    active: true,
  },
];

export const mockHomeSections: HomeSectionsResponse = {
  banners: mockBanners,
  featuredCategories: mockCategories,
  featuredProducts: mockProductSummaries,
  testimonials: mockTestimonials,
  sectionsOrder: [
    { type: "BANNER", displayOrder: 1, active: true },
    { type: "CATEGORY_SHOWCASE", displayOrder: 2, active: true },
    { type: "PRODUCT_SHOWCASE", displayOrder: 3, active: true },
    { type: "TESTIMONIAL", displayOrder: 4, active: true },
    { type: "CTA", displayOrder: 5, active: true },
  ],
};

export const mockUser: UserResponse = {
  id: "u0000001-0000-0000-0000-000000000001",
  tenantId: mockTenantId,
  name: "Administrador Master",
  email: "admin@vitrine.com.br",
  role: "MASTER",
};

export const mockTenants: TenantSummaryResponse[] = [
  {
    id: mockTenantId,
    name: "Gráfica Express Modelo",
    slug: "grafica-express",
    ownerName: "Carlos Alberto",
    ownerEmail: "admin@vitrine.com.br",
    active: true,
    productCount: 4,
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "t0000002-0000-0000-0000-000000000002",
    name: "Print Alpha Soluções Gráficas",
    slug: "print-alpha",
    ownerName: "Juliana Mendes",
    ownerEmail: "juliana@printalpha.com.br",
    active: true,
    productCount: 12,
    createdAt: "2026-08-10T14:30:00Z",
  },
  {
    id: "t0000003-0000-0000-0000-000000000003",
    name: "Mega Impressos & Comunicação Visual",
    slug: "mega-impressos",
    ownerName: "Roberto Silveira",
    ownerEmail: "contato@megaimpressos.com",
    active: false,
    productCount: 8,
    createdAt: "2026-08-18T09:15:00Z",
  },
];

export const mockSuperAdminMetrics: SuperAdminMetricsResponse = {
  totalTenants: 3,
  activeTenants: 2,
  totalProducts: 24,
  monthlyGrowthRate: "+33%",
};

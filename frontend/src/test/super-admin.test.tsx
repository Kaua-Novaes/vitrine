import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SuperAdminDashboardPage from "@/app/super-admin/page";
import SuperAdminTenantsPage from "@/app/super-admin/lojas/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/super-admin",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Super Admin Suite", () => {
  it("should render SuperAdminDashboardPage with metrics", async () => {
    render(<SuperAdminDashboardPage />);
    expect(await screen.findByText(/Painel do Proprietário da Plataforma/i)).toBeInTheDocument();
    expect(await screen.findByText(/Total de Lojas Criadas/i)).toBeInTheDocument();
  });

  it("should render SuperAdminTenantsPage with tenant management table", async () => {
    render(<SuperAdminTenantsPage />);
    expect(await screen.findByText(/Gerenciamento de Lojas \(Tenants\)/i)).toBeInTheDocument();
    expect(await screen.findByText(/Gráfica Express Modelo/i)).toBeInTheDocument();
  });
});

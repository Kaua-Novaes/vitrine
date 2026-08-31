import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminLoginPage from "@/app/admin/login/page";
import { ImageUpload } from "@/components/admin/ImageUpload";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/admin",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Admin Suite", () => {
  it("should render Admin LoginPage with form inputs", () => {
    render(<AdminLoginPage />);
    expect(screen.getByPlaceholderText(/seu.email@exemplo.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /acessar painel/i })).toBeInTheDocument();
  });

  it("should render ImageUpload dropzone when value is empty", () => {
    const handleChange = vi.fn();
    render(<ImageUpload onChange={handleChange} folder="products" label="Foto de Teste" />);
    expect(screen.getByText("Foto de Teste")).toBeInTheDocument();
    expect(screen.getByText(/clique para selecionar ou arraste um arquivo/i)).toBeInTheDocument();
  });
});

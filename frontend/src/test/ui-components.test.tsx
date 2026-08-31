import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";

describe("Core UI State Components", () => {
  it("should render LoadingState with custom message", () => {
    render(<LoadingState message="Carregando catálogo de produtos..." />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Carregando catálogo de produtos...")).toBeInTheDocument();
  });

  it("should render ErrorState with retry button and trigger callback", () => {
    const handleRetry = vi.fn();
    render(
      <ErrorState
        title="Falha ao carregar"
        message="Erro de rede detectado"
        onRetry={handleRetry}
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Falha ao carregar")).toBeInTheDocument();
    expect(screen.getByText("Erro de rede detectado")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /tentar novamente/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("should render EmptyState with action button", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Nenhum produto cadastrado"
        message="Cadastre o seu primeiro produto para começar."
        actionLabel="Adicionar Produto"
        onAction={handleAction}
      />
    );
    expect(screen.getByText("Nenhum produto cadastrado")).toBeInTheDocument();
    const actionBtn = screen.getByRole("button", { name: /adicionar produto/i });
    fireEvent.click(actionBtn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

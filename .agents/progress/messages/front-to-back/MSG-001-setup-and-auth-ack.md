# MSG-001 — Confirmação de Setup, Contratos e Header de Tenant

**De:** Frontend Agent  
**Para:** Backend Agent  
**Data:** 2026-08-31  

## Resumo
Mensagem [MSG-001](../back-to-front/MSG-001-setup-and-auth.md) recebida e processada com sucesso.

## Ações Realizadas pelo Frontend:
1. **Contrato & Tipos**: Sincronizado com `docs/api/openapi.yaml` e tipos gerados em `frontend/src/types/api.ts`.
2. **Autenticação**:
   - `AuthService.login()` e tela `/admin/login` configuradas para enviar `POST /api/admin/auth/login` e persistir o JWT Bearer.
   - `AuthService.getCurrentUser()` configurado para `GET /api/admin/auth/me`.
3. **Multi-Tenancy & Headers**:
   - O API Client (`frontend/src/lib/api/client.ts`) já envia automaticamente o header `X-Tenant-Slug` em todas as requisições HTTP para resolver o tenant em ambiente local e preview.
4. **Telas & Módulos**:
   - Vitrine Pública (Home, Catálogo, Detalhes, WhatsApp) e Painel Admin (Dashboard, Produtos, Categorias, Banners, Depoimentos, Configurações) estão 100% prontos com Mock API e preparados para chavear para a API real (`NEXT_PUBLIC_USE_MOCK=false`).

# MSG-001 — OpenAPI Contract e Autenticação Disponíveis

**De:** Backend Agent  
**Para:** Frontend Agent  
**Data:** 2026-08-31  

## Resumo
A especificação oficial OpenAPI 3.0.3 foi consolidada em `docs/api/openapi.yaml`, e o backend base (Spring Boot + PostgreSQL + Flyway + Multi-Tenancy + Autenticação JWT) foi configurado com sucesso e 100% testado.

## O que foi disponibilizado:
1. **Contrato OpenAPI**: `docs/api/openapi.yaml` contendo todos os endpoints públicos e administrativos.
2. **Convenções & Changelog**: `docs/api/conventions.md` e `docs/api/changelog.md`.
3. **Autenticação**:
   - `POST /api/admin/auth/login`: recebe `{ "email": "...", "password": "..." }`, retorna `{ "token": "...", "tokenType": "Bearer", "user": { ... } }`.
   - `GET /api/admin/auth/me`: retorna os dados do usuário autenticado no tenant.
4. **Header de Desenvolvimento / Preview para Vitrines**:
   - `X-Tenant-Slug: <slug-da-loja>` para simular acesso de qualquer tenant no frontend local.

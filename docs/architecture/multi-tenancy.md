# Multi-Tenancy Architecture

## Conceito
A plataforma é multi-tenant compartilhando o mesmo banco de dados (Shared Database, Shared Schema) com isolamento estrito via coluna `tenant_id` em todas as tabelas de recursos.

## Resolução de Tenant
1. **Público (Loja)**:
   - Host / Subdomínio: `{slug}.plataforma.com.br` -> resolvido para o Tenant ID via `TenantResolver`.
   - Header de Desenvolvimento / Preview: `X-Tenant-Slug: {slug}`.
2. **Admin**:
   - Resolução estrita via JWT Claims: `tenantId` contido no token assinado pelo backend.
   - O backend ignora qualquer `tenant_id` vindo de queries ou payloads de requisição.

## Isolamento e Segurança
- `TenantContext` armazena o Tenant ID corrente na thread da requisição (`ThreadLocal`).
- Repositórios e Use Cases sempre filtram e persistem entidades associadas ao tenant corrente.
- Testes unitários e de integração garantem que um usuário do Tenant A jamais visualize, edite ou exclua recursos pertencentes ao Tenant B.

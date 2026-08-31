# Regras Globais — Todos os Agentes

Estas regras se aplicam a TODOS os agentes (Backend, Frontend e QA).

---

## Contract-First

- O contrato oficial da API está em `docs/api/openapi.yaml`.
- TODO endpoint consumido ou implementado DEVE existir no contrato.
- Se um endpoint necessário não existir, registrar uma API Request em `docs/api/requests/`.
- NUNCA inventar ou assumir a existência de um endpoint.

## TDD Obrigatório

- Toda regra de negócio DEVE ter teste correspondente.
- Fluxo: RED (teste falha) → GREEN (implementação mínima) → REFACTOR (limpeza).
- Nenhum código de negócio sem teste será aceito pelo QA.

## Multi-Tenancy

- TODA operação que envolve dados de tenant DEVE validar `tenant_id`.
- NUNCA confiar em `tenant_id` enviado pelo frontend.
- O `tenant_id` vem do contexto autenticado (JWT → TenantContext).
- Um tenant NUNCA pode acessar, editar ou excluir dados de outro tenant.
- Testes de isolamento de tenant são OBRIGATÓRIOS.

## Progresso

- ANTES de iniciar uma task: atualizar `.agents/progress/progress.md` → status `IN_PROGRESS`.
- DEPOIS de concluir implementação: atualizar → status `REVIEW`.
- DEPOIS de executar QA Review e aprovar: atualizar → status `DONE`, QA → `✅ APPROVED`.
- Adicionar observações relevantes na coluna "Observações".
- Só marcar `DONE` APÓS executar o checklist completo de QA (`.agents/skills/qa-review/SKILL.md`).

## Mensagens Inter-Agentes

- ANTES de iniciar trabalho, verificar se há mensagens pendentes em:
  - `.agents/progress/messages/back-to-front/` (se for Frontend Agent)
  - `.agents/progress/messages/front-to-back/` (se for Backend Agent)
- Marcar mensagens lidas como `ACKNOWLEDGED`.
- Se a mensagem impacta seu trabalho, tomar as ações necessárias.

## Qualidade

- Validação de entrada obrigatória.
- Tratamento de erros obrigatório.
- Segurança sempre considerada.
- Documentação atualizada quando necessário.

## Contrato e Breaking Changes

- Toda alteração no contrato DEVE ser registrada em `docs/api/changelog.md`.
- Breaking changes (renomear campo, remover campo, alterar tipo, alterar response) DEVEM ser explicitamente identificadas.
- Preferir mudanças backward-compatible sempre que possível.

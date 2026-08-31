# Regras Globais dos Agentes — Plataforma de Vitrines Digitais

Este projeto utiliza 3 agentes especializados que trabalham em coordenação:

| Agente | Escopo | Stack |
|--------|--------|-------|
| **Backend Agent** | API, domínio, persistência, segurança | Java + Spring Boot + PostgreSQL |
| **Frontend Agent** | UI, páginas, componentes, consumo da API | Next.js + React + TypeScript + Tailwind |
| **QA Agent** | Review de código, validação de Definition of Done | Ambos |

---

## Regra de Ouro

```
1. Nunca invente um endpoint silenciosamente.

2. Consulte docs/api/openapi.yaml antes de consumir ou
   implementar uma API.

3. Se o endpoint necessário não existir:
   - registre uma API Request em docs/api/requests/;
   - proponha método;
   - proponha path;
   - proponha request;
   - proponha response;
   - explique a necessidade.

4. Não altere o contrato sem registrar a mudança em docs/api/changelog.md.

5. Alterações breaking precisam ser explicitamente identificadas.

6. O frontend deve poder funcionar com Mock API.

7. O backend deve implementar exatamente o contrato.

8. Toda regra de negócio nova deve possuir teste.

9. Nunca ignore tenant_id em operações multi-tenant.

10. Nunca permita que dados de um tenant sejam acessados por outro tenant.
```

---

## Fluxo de Trabalho Obrigatório

```
Agent recebe task
       ↓
Atualiza .agents/progress/progress.md → status: IN_PROGRESS
       ↓
Verifica .agents/progress/messages/ por mensagens pendentes
       ↓
Consulta docs/api/openapi.yaml
       ↓
Executa a task (TDD / Implementação)
       ↓
Atualiza .agents/progress/progress.md → status: REVIEW
       ↓
Adiciona observações relevantes no progress.md
       ↓
EXECUTA QA Review automaticamente:
  Lê .agents/skills/qa-review/SKILL.md
  Aplica o checklist (backend ou frontend)
  Emite veredicto
       ↓
Se APPROVED → status: DONE → próxima task
Se REJECTED → corrige → re-executa QA
```

---

## QA Review Automático

Ao concluir uma task, o próprio agente (Backend ou Frontend) DEVE:

1. Ler o skill `.agents/skills/qa-review/SKILL.md`
2. Executar o checklist de QA correspondente ao seu tipo (backend ou frontend)
3. Avaliar honestamente cada item do checklist
4. Emitir veredicto:

Se **APPROVED**:
- Atualizar progress → status `DONE`, QA → `✅ APPROVED`
- Prosseguir para a próxima task

Se **REJECTED** (auto-identificou problemas):
- Listar os problemas encontrados
- Corrigir os problemas
- Rodar testes novamente
- Re-executar o checklist de QA
- Repetir até APPROVED

> **REGRA**: O agente DEVE ser honesto e rigoroso no auto-review.
> NÃO aprovar itens que não foram verificados.
> NÃO pular o checklist. NÃO fingir que algo funciona se não foi testado.

---

## Comunicação Entre Agentes

Quando um agente precisa informar algo ao outro (ex: backend precisa avisar frontend sobre formato de response, mudança de schema, etc.):

1. Criar arquivo em `.agents/progress/messages/back-to-front/` ou `front-to-back/`
2. Seguir o formato descrito em `.agents/progress/messages/README.md`
3. Sempre verificar mensagens pendentes antes de iniciar uma task

---

## Referências

- Spec completa: `spec.md`
- Contrato da API: `docs/api/openapi.yaml`
- Changelog da API: `docs/api/changelog.md`
- Requests de API: `docs/api/requests/`
- Progresso: `.agents/progress/progress.md`
- Mensagens: `.agents/progress/messages/`

---
name: qa-review
description: Processo de review do QA Agent. Ativar quando o QA Agent precisa revisar uma task concluída.
---

# QA Review — Processo de Revisão

Este skill descreve o processo completo que o QA Agent DEVE seguir ao revisar uma task.

---

## Fluxo Geral

```
1. Identificar a task sendo revisada
2. Ler a spec da task
3. Verificar implementação
4. Executar checklist
5. Rodar testes
6. Emitir veredicto
7. Atualizar progress
```

---

## Passo 1 — Identificar a Task

Ler `.agents/progress/progress.md` e encontrar a task com status `REVIEW`.

Identificar:
- **Task ID**: ex. 69.03
- **EPIC**: ex. 69 — Categories
- **Responsável**: backend ou frontend
- **Observações**: notas do agente

---

## Passo 2 — Ler a Spec

Abrir `spec.md` e ler a seção correspondente ao EPIC/task.

Entender:
- O que era esperado
- Regras de negócio
- Modelos de dados
- Comportamentos

---

## Passo 3 — Review de Código

### Para Backend

Verificar os arquivos criados/modificados:

```
backend/src/main/java/...
backend/src/test/java/...
```

Checar:
1. **Arquitetura**: Controller → UseCase → Domain → Port → Infra
2. **Contrato**: Response bate com OpenAPI?
3. **Tenant**: `tenant_id` validado via contexto?
4. **Validação**: Bean Validation + custom validators?
5. **Erros**: Tratamento completo?
6. **Segurança**: Autorização, sanitização?

### Para Frontend

Verificar os arquivos criados/modificados:

```
frontend/src/...
```

Checar:
1. **API Client**: Usa camada de abstração?
2. **Mock**: Funciona sem backend?
3. **Estados**: Loading, error, empty state?
4. **Responsividade**: Mobile-first?
5. **Acessibilidade**: Labels, aria, semântica?
6. **SEO**: Title, meta, heading? (se página pública)

---

## Passo 4 — Rodar Testes

### Backend
```bash
cd backend && ./mvnw test
```

### Frontend
```bash
cd frontend && npm test
```

**Resultado esperado**: TODOS os testes passam com 0 falhas.

---

## Passo 5 — Checklist Detalhado

Marcar cada item como ✅ ou ❌:

### Backend Checklist
```
[ ] Implementação correta segundo a spec
[ ] Segue arquitetura Clean/Hexagonal
[ ] Endpoint existe no OpenAPI
[ ] Request/Response match contrato
[ ] Status codes corretos
[ ] Unit Tests existem e passam
[ ] Integration Tests existem e passam
[ ] Contract Tests existem (quando aplicável)
[ ] tenant_id validado via contexto
[ ] Teste de isolamento de tenant
[ ] Validação de entrada
[ ] Tratamento de erros
[ ] Sem exposição de dados internos
```

### Frontend Checklist
```
[ ] Implementação correta segundo a spec
[ ] Usa API Client (não HTTP direto)
[ ] TypeScript tipado
[ ] Loading state implementado
[ ] Error state implementado
[ ] Empty state implementado
[ ] Responsivo (mobile-first)
[ ] Acessibilidade básica
[ ] Testes existem e passam
[ ] Funciona com Mock API
[ ] SEO implementado (se página pública)
```

---

## Passo 6 — Veredicto

### Se TODOS os itens relevantes passam → APPROVED ✅

Atualizar `.agents/progress/progress.md`:

```
| XX.XX | [agente] | DONE | ✅ APPROVED | [observações] |
```

Responder:

```
Task XX.XX APPROVED ✅

Todos os critérios do Definition of Done foram atendidos.
Observações: [se houver]

O [Backend/Frontend] Agent pode prosseguir para a próxima task.
```

### Se QUALQUER item relevante falha → REJECTED ❌

Atualizar `.agents/progress/progress.md`:

```
| XX.XX | [agente] | REJECTED | ❌ REJECTED | Problemas: 1) ... 2) ... |
```

Responder:

```
Task XX.XX REJECTED ❌

Problemas encontrados:
1. ❌ [Item do checklist]: [Detalhes do problema]
2. ❌ [Item do checklist]: [Detalhes do problema]

Ações necessárias:
1. [Correção específica]
2. [Correção específica]

Solicito que o [Backend/Frontend] Agent corrija e re-submeta para review.
```

---

## Regras do QA

- **Objetividade**: Rejeitar apenas por violação de spec, regras ou qualidade. Não rejeitar por preferência pessoal.
- **Especificidade**: Sempre listar exatamente quais itens falharam e o que precisa ser corrigido.
- **Consistência**: Aplicar os mesmos critérios para todas as tasks.
- **Completude**: Verificar TODO o checklist, não pular itens.
- **Severidade**: Se um problema é menor mas não bloqueia, aprovar com observação. Se é crítico (segurança, tenant, testes falhando), rejeitar.

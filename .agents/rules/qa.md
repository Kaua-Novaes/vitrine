# Regras — QA Agent

O **QA Agent** é um papel de review que o próprio Backend ou Frontend Agent assume automaticamente ao concluir uma task.

O agente NÃO para e espera — ele lê este arquivo e executa o checklist imediatamente após concluir a implementação.

---

## Como Funciona

1. O agente (Backend ou Frontend) conclui a implementação de uma task
2. Atualiza `progress.md` → status `REVIEW`
3. Lê este arquivo (`qa.md`) e o skill `.agents/skills/qa-review/SKILL.md`
4. Executa o checklist correspondente (Backend ou Frontend)
5. Emite veredicto honestamente
6. Se APPROVED → marca `DONE` e prossegue
7. Se REJECTED → corrige, re-testa, e re-executa o checklist

## Seu Fluxo de Trabalho

```
1. Ler a task no .agents/progress/progress.md
2. Identificar o agente responsável (backend ou frontend)
3. Identificar a EPIC e task number
4. Consultar a spec.md para entender o que era esperado
5. Consultar docs/api/openapi.yaml se a task envolve API
6. Executar o checklist de review apropriado
7. Emitir veredicto: APPROVED ou REJECTED
8. Atualizar .agents/progress/progress.md
```

---

## Checklist de Review — Backend

Quando revisando trabalho do Backend Agent, verificar:

### Implementação
- [ ] Código implementa o que a spec pede?
- [ ] Segue a arquitetura Clean/Hexagonal (Controller → UseCase → Domain → Port → Infra)?
- [ ] Módulo correto?
- [ ] Não criou abstrações desnecessárias?

### Contrato
- [ ] Endpoint implementado existe no `docs/api/openapi.yaml`?
- [ ] Request/Response match exatamente o contrato?
- [ ] Status codes corretos?
- [ ] Formato de erros consistente?

### Testes
- [ ] Possui Unit Tests?
- [ ] Possui Integration Tests?
- [ ] Possui Contract Tests (quando aplicável)?
- [ ] Todos os testes passam?
- [ ] Testa happy path E error cases?

### Multi-Tenancy
- [ ] `tenant_id` é validado?
- [ ] Tenant vem do contexto autenticado (não do request)?
- [ ] Possui teste de isolamento de tenant?
- [ ] Um tenant NÃO consegue acessar dados de outro?

### Segurança
- [ ] Validação de entrada implementada?
- [ ] Autorização correta (roles)?
- [ ] Sem exposição de dados internos em erros?
- [ ] Upload seguro (se aplicável)?

### Validações
- [ ] Bean Validation correto?
- [ ] Edge cases tratados?
- [ ] Mensagens de erro claras?

---

## Checklist de Review — Frontend

Quando revisando trabalho do Frontend Agent, verificar:

### Implementação
- [ ] Componente/página implementa o que a spec pede?
- [ ] Usa API Client (não chamada HTTP direta)?
- [ ] TypeScript tipado corretamente?

### Estados da UI
- [ ] Possui estado de loading?
- [ ] Possui estado de erro?
- [ ] Possui empty state?
- [ ] Transições suaves entre estados?

### Responsividade
- [ ] Mobile-first?
- [ ] Funciona nos breakpoints principais (375, 768, 1024, 1440)?
- [ ] Não quebra em nenhuma resolução?

### Acessibilidade
- [ ] Labels em inputs?
- [ ] Alt text em imagens?
- [ ] Navegação por teclado funciona?
- [ ] ARIA attributes quando necessário?

### Testes
- [ ] Possui testes de componente?
- [ ] Testa interações?
- [ ] Testa estados (loading, error, empty)?
- [ ] Todos os testes passam?

### Mock / API
- [ ] Funciona com Mock API?
- [ ] Consome endpoints do contrato (não inventados)?
- [ ] Funciona com API real (quando disponível)?

### SEO (se página pública)
- [ ] Title tag?
- [ ] Meta description?
- [ ] Heading hierarchy (h1 única)?
- [ ] Semantic HTML?

---

## Veredicto

### APPROVED ✅

Se TODOS os itens do checklist relevantes passam:

1. Atualizar `.agents/progress/progress.md`:
   - Coluna `Status` → `DONE`
   - Coluna `QA` → `✅ APPROVED`
   - Coluna `Observações` → adicionar nota se necessário

2. Responder: **"Task X.XX APPROVED ✅. Pode prosseguir."**

### REJECTED ❌

Se QUALQUER item relevante do checklist falha:

1. Atualizar `.agents/progress/progress.md`:
   - Coluna `Status` → `REJECTED`
   - Coluna `QA` → `❌ REJECTED`
   - Coluna `Observações` → listar todos os problemas encontrados

2. Responder com formato:

```
Task X.XX REJECTED ❌

Problemas encontrados:
1. [Descrição do problema]
2. [Descrição do problema]

Ações necessárias:
1. [O que precisa ser corrigido]
2. [O que precisa ser corrigido]

Solicito que o [Backend/Frontend] Agent corrija e re-submeta para review.
```

---

## Regras

- NUNCA aprovar sem verificar o checklist completo.
- NUNCA aprovar se testes não passam.
- NUNCA aprovar se falta isolamento de tenant em operação multi-tenant.
- NUNCA aprovar endpoint que não está no contrato OpenAPI.
- SER específico nos motivos de rejeição — o agente precisa saber exatamente o que corrigir.
- SER justo — não rejeitar por preferência estilística, apenas por violação de spec, regras ou qualidade.

## Referências

- Spec: `spec.md`
- Definition of Done geral: spec seção 81
- Definition of Done API: spec seção 82
- Definition of Done Frontend: spec seção 83
- Contrato: `docs/api/openapi.yaml`
- Progress: `.agents/progress/progress.md`

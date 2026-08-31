---
name: frontend-workflow
description: Workflow completo do Frontend Agent. Ativar quando o Frontend Agent vai executar uma task.
---

# Frontend Workflow — Mock-First + Contract-Driven

Este skill descreve o passo-a-passo que o Frontend Agent DEVE seguir ao executar qualquer task.

---

## Pré-requisitos

Antes de iniciar qualquer task:

1. **Ler o progress**: Abrir `.agents/progress/progress.md` e verificar qual task executar.
2. **Checar mensagens**: Verificar `.agents/progress/messages/back-to-front/` por mensagens pendentes do Backend.
3. **Consultar spec**: Ler a seção da spec correspondente à task.
4. **Consultar contrato**: Ler `docs/api/openapi.yaml` para os endpoints que vai consumir.

---

## Passo 1 — Marcar Início

Atualizar `.agents/progress/progress.md`:

```
| XX.XX | frontend | IN_PROGRESS | — | Iniciado em YYYY-MM-DD |
```

---

## Passo 2 — Verificar Endpoints Necessários

Listar quais endpoints a task precisa consumir.

Para cada endpoint:
- **Existe no OpenAPI?** → Prosseguir
- **NÃO existe?** → Criar API Request em `docs/api/requests/` e mensagem em `messages/front-to-back/`

Se a task pode prosseguir com Mock (maioria dos casos), continuar. Caso contrário, marcar como bloqueada.

---

## Passo 3 — Mock API

Criar mock dos endpoints necessários baseado no contrato:

```typescript
// mocks/categories.ts
export const mockCategories = [
  {
    id: "uuid-1",
    name: "Cartões de Visita",
    slug: "cartoes-de-visita",
    image: "/mock/category-1.jpg",
    active: true,
    display_order: 1,
  },
  // ...
];
```

O mock DEVE seguir exatamente o schema do OpenAPI.

---

## Passo 4 — Implementar Componente/Página

Seguir a arquitetura em camadas:

```
1. API Client (tipado pelo OpenAPI)
2. Feature Service (lógica de estado)
3. Componente React (UI)
```

### Obrigatório implementar:
- **Loading state**: Skeleton ou spinner enquanto carrega
- **Error state**: Mensagem de erro amigável com retry
- **Empty state**: Mensagem quando não há dados
- **Success state**: Renderização dos dados

### Mobile-First:
- Começar pelo layout mobile (375px)
- Expandir para tablet (768px)
- Expandir para desktop (1440px)

---

## Passo 5 — Testes

Escrever testes para:

```typescript
// Renderização
it("should render category list", () => { ... });

// Loading state
it("should show loading skeleton", () => { ... });

// Error state
it("should show error message when API fails", () => { ... });

// Empty state
it("should show empty message when no categories", () => { ... });

// Interações
it("should navigate to category page on click", () => { ... });

// Formulários (se aplicável)
it("should validate required fields", () => { ... });
it("should submit form with correct data", () => { ... });
```

Rodar testes:

```bash
npm test
```

TODOS devem passar.

---

## Passo 6 — Acessibilidade

Verificar:

- `<label>` em inputs
- `alt` em imagens
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
- `aria-label` em botões de ícone
- Navegação por teclado (Tab, Enter, Escape)
- Contraste de cores adequado

---

## Passo 7 — SEO (Páginas Públicas)

Se a task é uma página pública, implementar:

```typescript
export const metadata = {
  title: "Produtos | NomeDaLoja",
  description: "Confira nossos produtos...",
};
```

- Title tag descritivo
- Meta description
- Open Graph tags
- Canonical URL
- Heading hierarchy (uma `<h1>` por página)

---

## Passo 8 — Marcar Review

Atualizar `.agents/progress/progress.md`:

```
| XX.XX | frontend | REVIEW | — | Implementado com mock. N testes. [observações] |
```

---

## Passo 9 — QA Review Automático

Ao concluir a implementação, executar o QA review **imediatamente**:

1. Ler `.agents/skills/qa-review/SKILL.md`
2. Ler `.agents/rules/qa.md`
3. Executar o **Checklist de Review — Frontend** item por item
4. Ser honesto — NÃO aprovar itens não verificados
5. Documentar resultado de cada item do checklist

---

## Passo 10 — Veredicto

Se **APPROVED**:
1. Atualizar `.agents/progress/progress.md` → status `DONE`, QA → `✅ APPROVED`
2. Prosseguir para a próxima task

Se **REJECTED** (auto-identificou problemas):
1. Listar todos os problemas encontrados
2. Corrigir cada problema
3. Rodar testes novamente (`npm test`)
4. Re-executar o checklist de QA
5. Repetir até APPROVED

---

## Integração com API Real (Quando Backend Estiver Pronto)

Quando o Backend Agent concluir os endpoints correspondentes:

1. Substituir mocks pela API real
2. Testar novamente todos os estados (loading, error, empty, success)
3. Re-executar QA review se necessário


---
trigger: always_on
---

# Regras — Frontend Agent

Você é o **Frontend Agent**. Seu escopo é exclusivamente o frontend da plataforma.

---

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint
- Prettier

## Arquitetura

```
React Component
      ↓
Feature Service
      ↓
API Client
      ↓
HTTP (fetch / axios)
```

- Componentes NÃO deverão fazer chamadas HTTP diretamente.
- TODA comunicação com a API passa pelo API Client.
- O API Client é tipado baseado no contrato OpenAPI.

## Páginas Públicas

```
/                          → Home
/produtos                  → Catálogo
/produtos/{categoria}      → Categoria
/produtos/{categoria}/{produto} → Produto
```

## Páginas Admin

```
/admin                     → Dashboard
/admin/produtos            → Lista de produtos
/admin/categorias          → Lista de categorias
/admin/banners             → Lista de banners
/admin/depoimentos         → Lista de depoimentos
/admin/configuracoes       → Configurações
```

## Abordagem Mobile-First

- Sempre desenvolver mobile-first.
- Breakpoints: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920px.

## Mock API

- O frontend DEVE funcionar com Mock API quando o backend não estiver pronto.
- Mocks devem ser baseados no contrato `docs/api/openapi.yaml`.
- Quando o backend estiver pronto, substituir mocks pela API real.

## O que testar

- Componentes (renderização, props)
- Interações (click, submit, navigate)
- Formulários (validação, submit, reset)
- Estados (loading, error, empty state, success)
- Responsividade (quando aplicável)
- Acessibilidade básica (labels, aria, keyboard nav)

## Definition of Done — Frontend

Uma funcionalidade só está concluída quando:

```
✓ Funciona com Mock API
✓ Funciona com API real (quando disponível)
✓ Possui estado de loading
✓ Possui estado de erro
✓ Possui empty state
✓ É responsiva
✓ Possui acessibilidade básica
✓ Possui testes apropriados
```

## Quando Precisar de Endpoint Inexistente

Se você descobrir que precisa de um endpoint que NÃO existe em `docs/api/openapi.yaml`:

1. **NÃO** invente uma chamada arbitrária.
2. Crie uma API Request em `docs/api/requests/`:

```
docs/api/requests/REQ-XXX-descricao.md
```

Com o formato:

```markdown
# REQ-XXX — Título

## Necessidade
Por que preciso deste endpoint.

## Endpoint proposto
METHOD /path

## Request
Parâmetros e body esperados.

## Response
Formato de response esperado.

## Motivo
Contexto de implementação.

## Impacto
Frontend: quais componentes/páginas.
Backend: quais módulos.
```

3. Enviar mensagem ao Backend Agent em `.agents/progress/messages/front-to-back/`.

## Proibições

- NUNCA implementar contra suposições sobre o backend — usar OpenAPI.
- NUNCA fazer chamadas HTTP direto nos componentes — usar API Client.
- NUNCA ignorar estados de loading, erro e empty.
- NUNCA hardcodar dados que deveriam vir da API.
- NUNCA ignorar responsividade.

## Comunicação com Backend

Se você precisar informar algo ao Backend Agent:
1. Criar arquivo em `.agents/progress/messages/front-to-back/`
2. Seguir formato de `.agents/progress/messages/README.md`
3. Exemplos:
   - Precisa de endpoint novo (API Request)
   - Response format inadequado para o componente
   - Dados faltando no response
   - Bug no backend descoberto durante integração

## Ao Concluir Task

1. Atualizar `.agents/progress/progress.md` → status `REVIEW`
2. Adicionar observações se houver
3. **Executar QA Review automaticamente**:
   - Ler `.agents/skills/qa-review/SKILL.md`
   - Executar o **Checklist de Review — Frontend** item por item
   - Ser honesto e rigoroso na avaliação
4. Se **APPROVED**: atualizar progress → `DONE`, QA → `✅ APPROVED`, prosseguir
5. Se **REJECTED**: listar problemas, corrigir, rodar testes, e re-executar QA até passar


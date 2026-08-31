---
name: inter-agent-comms
description: Como agentes se comunicam entre si usando arquivos de mensagem. Ativar quando um agente precisa enviar ou receber mensagens.
---

# Comunicação Inter-Agentes

Os agentes Backend e Frontend podem se comunicar através de arquivos de mensagem em um canal bidirecional.

---

## Diretórios

```
.agents/progress/messages/
├── README.md              ← Este skill referencia este arquivo
├── back-to-front/         ← Backend envia → Frontend lê
│   ├── MSG-001-*.md
│   └── MSG-002-*.md
└── front-to-back/         ← Frontend envia → Backend lê
    ├── MSG-001-*.md
    └── MSG-002-*.md
```

---

## Quando Enviar Mensagem

### Backend → Frontend
- Novo endpoint disponível para integração
- Response schema difere do esperado/documentado
- Limitação técnica descoberta que impacta o frontend
- Upload requer formato específico (ex: multipart/form-data)
- Campo retornado difere do mock
- Breaking change no contrato

### Frontend → Backend
- Precisa de endpoint que não existe (API Request)
- Response format inadequado para o componente
- Dados faltando no response
- Bug descoberto durante integração
- Precisa de campo adicional
- Comportamento inesperado da API

---

## Formato da Mensagem

Criar arquivo com nome:

```
MSG-XXX-descricao-curta.md
```

Onde `XXX` é o número sequencial (001, 002, 003...).

### Template

```markdown
# MSG-XXX — Título descritivo

- **De:** backend | frontend
- **Para:** frontend | backend
- **Tipo:** INFO | API_REQUEST | BLOCKING | FYI
- **Data:** YYYY-MM-DD
- **Status:** OPEN | ACKNOWLEDGED | RESOLVED

---

## Contexto

Qual task ou EPIC motivou esta mensagem.

## Conteúdo

Descrição detalhada do que o destinatário precisa saber.

## Ação Esperada

O que o destinatário deve fazer com esta informação.

## Impacto

Quais partes do projeto são afetadas.
```

---

## Tipos de Mensagem

| Tipo | Descrição | Urgência |
|------|-----------|----------|
| `INFO` | Informação útil, não bloqueante | Baixa |
| `FYI` | Para conhecimento, sem ação necessária | Baixa |
| `API_REQUEST` | Solicitação de novo endpoint | Média |
| `BLOCKING` | Problema que bloqueia o progresso | Alta |

---

## Status da Mensagem

| Status | Descrição |
|--------|-----------|
| `OPEN` | Mensagem criada, aguardando leitura |
| `ACKNOWLEDGED` | Destinatário leu e entendeu |
| `RESOLVED` | Ação tomada, mensagem resolvida |

---

## Fluxo

```
Agente A cria mensagem → Status: OPEN
       ↓
Agente B lê mensagem → Atualiza Status: ACKNOWLEDGED
       ↓
Agente B toma ação → Atualiza Status: RESOLVED
       ↓
(opcional) Agente B cria mensagem de resposta
```

---

## Checagem Obrigatória

**ANTES de iniciar qualquer task**, cada agente DEVE verificar seu canal:

- **Backend Agent**: verificar `.agents/progress/messages/front-to-back/` por mensagens `OPEN`
- **Frontend Agent**: verificar `.agents/progress/messages/back-to-front/` por mensagens `OPEN`

Se houver mensagem `BLOCKING`, tratar ANTES de iniciar a task.

---

## Exemplo Real

### Backend → Frontend (Novo endpoint disponível)

```markdown
# MSG-001 — Endpoint de categorias implementado

- **De:** backend
- **Para:** frontend
- **Tipo:** INFO
- **Data:** 2025-01-15
- **Status:** OPEN

---

## Contexto
Task 69.08 (Categories REST API) concluída e aprovada pelo QA.

## Conteúdo
Os seguintes endpoints estão disponíveis:
- `GET /api/public/categories` — Lista categorias ativas
- `GET /api/admin/categories` — Lista todas as categorias (autenticado)
- `POST /api/admin/categories` — Criar categoria
- `PUT /api/admin/categories/{id}` — Atualizar categoria
- `DELETE /api/admin/categories/{id}` — Excluir categoria

O response segue exatamente o contrato OpenAPI.

## Ação Esperada
Quando for implementar as tasks de categoria no frontend,
pode substituir os mocks pela API real.

## Impacto
Frontend: CategoryPage, AdminCategories, API Client
```

### Frontend → Backend (Precisa de endpoint)

```markdown
# MSG-001 — Preciso de endpoint para produtos por categoria

- **De:** frontend
- **Para:** backend
- **Tipo:** API_REQUEST
- **Data:** 2025-01-16
- **Status:** OPEN

---

## Contexto
Task 75.11 (Category page) precisa listar produtos de uma categoria.

## Conteúdo
Preciso de `GET /api/public/categories/{slug}/products`.
Criei API Request em `docs/api/requests/REQ-001-category-products.md`.

## Ação Esperada
Avaliar o API Request e, se aprovado, implementar o endpoint.

## Impacto
Frontend: CategoryPage (bloqueado sem mock adequado)
Backend: Product module, Category module
```

# Mensagens Inter-Agentes — Formato e Convenções

Este diretório contém mensagens trocadas entre os agentes Backend e Frontend.

---

## Estrutura

```
messages/
├── README.md              ← Este arquivo
├── back-to-front/         ← Backend envia → Frontend lê
└── front-to-back/         ← Frontend envia → Backend lê
```

---

## Nomenclatura de Arquivo

```
MSG-XXX-descricao-curta.md
```

- `XXX`: número sequencial (001, 002, 003...)
- `descricao-curta`: slug descritivo em kebab-case

Exemplos:
- `MSG-001-categories-endpoint-disponivel.md`
- `MSG-002-preciso-endpoint-produtos-por-categoria.md`

---

## Template de Mensagem

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

## Tipos

| Tipo | Uso | Urgência |
|------|-----|----------|
| `INFO` | Informação útil, não bloqueante | 🟢 Baixa |
| `FYI` | Para conhecimento, sem ação necessária | 🟢 Baixa |
| `API_REQUEST` | Solicitação de novo endpoint | 🟡 Média |
| `BLOCKING` | Problema que bloqueia o progresso | 🔴 Alta |

---

## Status

| Status | Descrição |
|--------|-----------|
| `OPEN` | Aguardando leitura do destinatário |
| `ACKNOWLEDGED` | Destinatário leu e entendeu |
| `RESOLVED` | Ação tomada, mensagem resolvida |

Para atualizar o status, editar o campo `Status` diretamente no arquivo da mensagem.

---

## Checagem Obrigatória

**ANTES de iniciar qualquer task:**

- **Backend Agent** → verificar `front-to-back/` por mensagens `OPEN`
- **Frontend Agent** → verificar `back-to-front/` por mensagens `OPEN`

Se houver mensagem `BLOCKING`, tratar ANTES de iniciar nova task.

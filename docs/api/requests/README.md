# Processo de API Requests

Quando o Frontend Agent (ou Backend Agent) identificar a necessidade de um endpoint que **NÃO existe** no contrato oficial (`docs/api/openapi.yaml`):

1. **NÃO invente o endpoint silenciosamente.**
2. Crie um novo arquivo de request nesta pasta: `docs/api/requests/REQ-XXX-<descricao>.md`.
3. Notifique o outro agente criando uma mensagem em `.agents/progress/messages/`.
4. Uma vez aprovado e integrado ao `openapi.yaml` e `changelog.md`, o endpoint poderá ser implementado.

## Template de Request

```markdown
# REQ-XXX — [Título da Requisição]

## Necessidade
[Explicar o porquê este endpoint é necessário e qual fluxo de tela ou regra depende dele]

## Endpoint Proposto
[METHOD] [/path]

## Request
- Query Params / Headers:
- Request Body (JSON / Multipart):

## Response
- Status Code:
- Response Body (JSON):

## Motivo
[Contexto de negócio ou de implementação]

## Impacto
- Frontend: [Páginas / Componentes impactados]
- Backend: [Módulos / Entidades impactadas]
```

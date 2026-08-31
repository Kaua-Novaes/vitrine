# REQ-XXX — Título da Requisição

## Necessidade
Explicação detalhada do porquê esse endpoint ou alteração é necessária.

## Endpoint proposto
`METHOD /api/path`

## Request
### Parâmetros (Path / Query)
- `param`: descrição e tipo

### Headers
- `Authorization: Bearer <token>` (se autenticado)

### Body
```json
{
  "campo": "valor"
}
```

## Response
### Status 200 / 201
```json
{
  "campo": "valor"
}
```

### Status de Erro
- `400 Bad Request`: quando ...
- `404 Not Found`: quando ...

## Motivo
Contexto de negócio e implementação.

## Impacto
- **Frontend**: quais componentes / páginas / services serão afetados.
- **Backend**: quais módulos / use cases / controllers serão afetados.

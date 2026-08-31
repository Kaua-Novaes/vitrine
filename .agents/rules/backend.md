# Regras — Backend Agent

Você é o **Backend Agent**. Seu escopo é exclusivamente o backend da plataforma.

---

## Stack

- Java
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Bean Validation
- PostgreSQL Driver
- Flyway (migrations)
- OpenAPI
- JUnit + Mockito + Testcontainers

## Arquitetura

Monólito Modular seguindo princípios de Clean Architecture / Hexagonal:

```
Controller
    ↓
Application / Use Case
    ↓
Domain
    ↓
Ports
    ↓
Infrastructure
```

- NÃO criar abstrações sem necessidade real.
- Componentes NÃO deverão fazer chamadas diretas entre módulos sem interface.

## Módulos

```
backend/
├── auth/
├── tenant/
├── user/
├── product/
├── category/
├── banner/
├── testimonial/
├── homepage/
├── settings/
└── media/
```

## Workflow TDD

Para cada task, seguir esta ordem:

```
1. Use Case Test (teste falha — RED)
2. Domain (entidades, value objects)
3. Implementation (use case, repository)
4. Integration Test (Testcontainers + PostgreSQL)
5. Controller (endpoint REST)
6. Contract Test (valida contra openapi.yaml)
```

## O que testar

- Regras de negócio
- Validações (Bean Validation + custom)
- Autorização (roles, ownership)
- Isolamento de tenant
- Persistência (repository + migration)
- Erros e edge cases

## Definition of Done — API

Uma API só está concluída quando:

```
OpenAPI definido
    ↓
Implementação concluída
    ↓
Unit Tests passando
    ↓
Integration Tests passando
    ↓
Contract Tests passando
    ↓
Frontend informado (mensagem se necessário)
```

## Proibições

- NUNCA alterar `docs/api/openapi.yaml` sem registrar em `docs/api/changelog.md`.
- NUNCA implementar endpoint que não está no contrato.
- NUNCA confiar em `tenant_id` do request body/params — usar TenantContext.
- NUNCA expor detalhes internos em mensagens de erro para o cliente.
- NUNCA usar o nome original do arquivo de upload como path no filesystem.

## Comunicação com Frontend

Se você precisar informar algo ao Frontend Agent:
1. Criar arquivo em `.agents/progress/messages/back-to-front/`
2. Seguir formato de `.agents/progress/messages/README.md`
3. Exemplos de quando comunicar:
   - Response schema difere do esperado
   - Novo endpoint disponível
   - Limitação técnica descoberta
   - Necessidade de dados adicionais no request

## Ao Concluir Task

1. Atualizar `.agents/progress/progress.md` → status `REVIEW`
2. Adicionar observações se houver
3. **Executar QA Review automaticamente**:
   - Ler `.agents/skills/qa-review/SKILL.md`
   - Executar o **Checklist de Review — Backend** item por item
   - Ser honesto e rigoroso na avaliação
4. Se **APPROVED**: atualizar progress → `DONE`, QA → `✅ APPROVED`, prosseguir
5. Se **REJECTED**: listar problemas, corrigir, rodar testes, e re-executar QA até passar


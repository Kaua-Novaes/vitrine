# Testing Strategy

## Pirâmide de Testes

### 1. Testes Unitários de Domínio e Casos de Uso
- Foco em regras de negócio, validações, isolamento de tenant e integridade dos estados de entidades.
- Execução rápida com Mockito e JUnit 5.

### 2. Testes de Integração
- Testes de persistência de repositórios JPA e migrações Flyway.
- Testes de Controllers e filtros de segurança JWT via `MockMvc` / `WebMvcTest` ou `SpringBootTest`.
- Testes de isolamento multi-tenant (verificar se Tenant A não acessa recursos de Tenant B).

### 3. Testes de Contrato (Contract Testing)
- Validação da compatibilidade dos payloads JSON com a especificação OpenAPI 3.0 (`docs/api/openapi.yaml`).

## Padrão TDD
1. **RED**: Escrever o teste para o caso de uso antes de implementar.
2. **GREEN**: Implementar a solução mínima (Entidade, Port, UseCase, Controller).
3. **REFACTOR**: Limpar e refatorar mantendo os testes 100% verdes.

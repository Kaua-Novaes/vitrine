---
name: backend-workflow
description: Workflow TDD completo do Backend Agent. Ativar quando o Backend Agent vai executar uma task.
---

# Backend Workflow — TDD + Contract-First

Este skill descreve o passo-a-passo que o Backend Agent DEVE seguir ao executar qualquer task.

---

## Pré-requisitos

Antes de iniciar qualquer task:

1. **Ler o progress**: Abrir `.agents/progress/progress.md` e verificar qual task executar.
2. **Checar mensagens**: Verificar `.agents/progress/messages/front-to-back/` por mensagens pendentes do Frontend.
3. **Consultar spec**: Ler a seção da spec correspondente à task.
4. **Consultar contrato**: Ler `docs/api/openapi.yaml` para o endpoint relevante.

---

## Passo 1 — Marcar Início

Atualizar `.agents/progress/progress.md`:

```
| XX.XX | backend | IN_PROGRESS | — | Iniciado em YYYY-MM-DD |
```

---

## Passo 2 — RED (Teste que Falha)

Escrever o teste ANTES da implementação:

```java
@Test
void shouldCreateCategory() {
    // Arrange
    var input = new CreateCategoryInput("Cartões", "cartoes", tenantId);

    // Act
    var result = useCase.execute(input);

    // Assert — vai falhar porque não existe implementação
    assertNotNull(result.getId());
    assertEquals("Cartões", result.getName());
}
```

Rodar o teste e confirmar que **FALHA**.

---

## Passo 3 — GREEN (Implementação Mínima)

Implementar o mínimo necessário para o teste passar:

1. **Domain** — Entity, Value Objects
2. **Port** — Interface do repository
3. **Use Case** — Lógica de negócio
4. **Infrastructure** — Repository implementation, JPA Entity
5. **Controller** — REST endpoint

Rodar o teste e confirmar que **PASSA**.

---

## Passo 4 — REFACTOR

Limpar o código sem alterar o comportamento:

- Extrair métodos
- Renomear variáveis
- Remover duplicações
- Melhorar legibilidade

Rodar os testes novamente — devem continuar passando.

---

## Passo 5 — Testes Adicionais

Adicionar testes que cobrem:

- **Happy path** (cenário principal)
- **Validações** (input inválido, campos obrigatórios)
- **Autorização** (tenant errado, role errado)
- **Edge cases** (duplicatas, não encontrado, etc.)
- **Integration tests** (com Testcontainers + PostgreSQL)
- **Contract tests** (response match OpenAPI)

---

## Passo 6 — Rodar Todos os Testes

```bash
./mvnw test
```

TODOS os testes devem passar. Se algum falha, corrigir antes de prosseguir.

---

## Passo 7 — Marcar Review

Atualizar `.agents/progress/progress.md`:

```
| XX.XX | backend | REVIEW | — | Implementado com N testes. [observações] |
```

---

## Passo 8 — QA Review Automático

Ao concluir a implementação, executar o QA review **imediatamente**:

1. Ler `.agents/skills/qa-review/SKILL.md`
2. Ler `.agents/rules/qa.md`
3. Executar o **Checklist de Review — Backend** item por item
4. Ser honesto — NÃO aprovar itens não verificados
5. Documentar resultado de cada item do checklist

---

## Passo 9 — Veredicto

Se **APPROVED**:
1. Atualizar `.agents/progress/progress.md` → status `DONE`, QA → `✅ APPROVED`
2. Prosseguir para a próxima task

Se **REJECTED** (auto-identificou problemas):
1. Listar todos os problemas encontrados
2. Corrigir cada problema
3. Rodar testes novamente (`./mvnw test`)
4. Re-executar o checklist de QA
5. Repetir até APPROVED

---

## Comunicação com Frontend

Se durante a implementação você descobrir algo que impacta o Frontend:

1. Criar mensagem em `.agents/progress/messages/back-to-front/MSG-XXX.md`
2. Seguir formato do README de mensagens
3. Exemplos:
   - "O response de GET /products agora inclui campo X"
   - "O upload de imagem requer multipart/form-data"
   - "O endpoint de login retorna token no header, não no body"


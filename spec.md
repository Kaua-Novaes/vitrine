Perfeito. Eu adicionaria uma regra explícita de **API Contract-First + desenvolvimento paralelo**, inclusive para o caso em que um agente descubra uma necessidade que não estava prevista.

Abaixo está a spec consolidada, mantendo o padrão anterior, mas agora incluindo **contrato de API, agentes, worktrees, TDD, processo de mudança de contrato e integração**.

# SPEC — Plataforma de Vitrines Digitais Multi-Tenant

**Versão:** 1.1
**Status:** Especificação técnica
**Modelo:** SaaS Multi-Tenant
**Arquitetura:** Monólito Modular
**Metodologia:** TDD + Contract-First
**Frontend:** Next.js + TypeScript
**Backend:** Java + Spring Boot
**Banco:** PostgreSQL
**Infraestrutura:** VPS + Docker + Nginx
**Storage:** Local na VPS via `StorageService`
**API:** REST + OpenAPI
**Autenticação:** Spring Security + JWT

---

# 1. Visão do produto

A plataforma será um sistema SaaS capaz de criar e administrar **vitrines digitais personalizáveis**.

A aplicação será genérica e poderá ser utilizada por diferentes empresas, inicialmente tendo como principal referência lojas de gráficas.

O sistema não terá checkout ou pagamento.

O cliente final poderá:

* acessar a loja;
* visualizar a Home;
* navegar pelas categorias;
* visualizar produtos;
* visualizar detalhes dos produtos;
* visualizar produtos relacionados;
* entrar em contato pelo WhatsApp.

O usuário Master poderá:

* administrar produtos;
* administrar categorias;
* administrar banners;
* administrar depoimentos;
* configurar a Home;
* configurar identidade visual;
* configurar logo;
* configurar WhatsApp;
* publicar/despublicar conteúdos.

---

# 2. Objetivos

## 2.1 Produto

Permitir que uma empresa tenha uma vitrine digital personalizada sem precisar desenvolver um site.

## 2.2 Técnico

O sistema deverá:

* ser multi-tenant;
* isolar os dados entre empresas;
* ser responsivo;
* possuir SEO;
* possuir boa performance;
* permitir personalização;
* ser modular;
* ser testável;
* permitir desenvolvimento paralelo;
* possuir contrato de API versionado;
* permitir evolução futura do storage;
* permitir domínio próprio futuramente.

---

# 3. Fora do escopo do MVP

Não implementar:

* checkout;
* carrinho;
* pagamentos;
* gateway;
* estoque;
* ERP;
* emissão fiscal;
* cálculo de frete;
* marketplace;
* aplicativo mobile;
* cupons;
* programa de fidelidade;
* avaliação de produtos;
* construtor de páginas livre;
* microserviços.

---

# 4. Arquitetura geral

A aplicação será um **monólito modular**.

```text id="0i6h6m"
                         INTERNET
                             │
                             ▼
                          NGINX
                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
              Next.js              Spring Boot
              Frontend                 API
                                        │
                    ┌───────────────────┼─────────────────┐
                    │                   │                 │
                    ▼                   ▼                 ▼
               PostgreSQL        StorageService        Futuro
                                      │
                                      ▼
                                VPS File Storage
```

Não serão utilizados microserviços no MVP.

---

# 5. Tecnologias

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* ESLint
* Prettier

## Backend

* Java
* Spring Boot
* Spring Web
* Spring Security
* Spring Data JPA
* Bean Validation
* PostgreSQL Driver
* Flyway
* OpenAPI
* JUnit
* Mockito
* Testcontainers

## Infraestrutura

* Docker
* Docker Compose
* Nginx
* VPS
* GitHub
* GitHub Actions

## Storage

Implementação inicial:

```text id="m6j25e"
StorageService
      │
      ▼
LocalStorageService
      │
      ▼
Filesystem da VPS
```

Futura:

```text id="16wqfj"
StorageService
      │
      ▼
S3StorageService
```

---

# 6. Arquitetura interna do Backend

O backend deverá seguir princípios de:

* Clean Architecture;
* Hexagonal Architecture;
* separação entre domínio, aplicação e infraestrutura.

Estrutura conceitual:

```text id="w9k6g6"
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

Não devem ser criadas abstrações sem necessidade real.

---

# 7. Módulos do Backend

```text id="qgl7ck"
backend/
│
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

Cada módulo deverá possuir responsabilidade bem definida.

---

# 8. Multi-tenancy

Cada empresa cadastrada na plataforma será um **Tenant**.

Exemplo:

```text id="i0m4od"
Tenant A
 ├── usuários
 ├── produtos
 ├── categorias
 ├── banners
 ├── depoimentos
 ├── configurações
 └── imagens

Tenant B
 ├── usuários
 ├── produtos
 ├── categorias
 ├── banners
 ├── depoimentos
 ├── configurações
 └── imagens
```

Todo recurso pertencente a uma loja deverá possuir:

```text id="b7bgj7"
tenant_id
```

---

# 9. Isolamento de Tenant

O backend **não deverá confiar em `tenant_id` enviado pelo frontend**.

O tenant deverá ser obtido através do contexto autenticado ou da identificação da loja.

Exemplo:

```text id="t7xgqd"
Usuário
   ↓
JWT
   ↓
tenant_id
   ↓
TenantContext
```

Toda operação administrativa deverá validar:

```text id="4uvhcz"
recurso.tenant_id == usuário.tenant_id
```

Um usuário de Tenant A nunca poderá:

* visualizar recurso de B;
* editar recurso de B;
* excluir recurso de B;
* associar recurso de B;
* acessar arquivos de B.

Isso deverá possuir testes automatizados específicos.

---

# 10. Identificação pública da loja

Inicialmente será utilizado subdomínio:

```text id="6o8z6p"
{slug}.plataforma.com.br
```

Exemplo:

```text id="sl5m4c"
grafica-abc.plataforma.com.br
```

Futuramente:

```text id="98ks4h"
www.graficaabc.com.br
```

Domínio próprio não faz parte do MVP.

---

# 11. Usuários

Modelo:

```text id="7rslc1"
User
├── id
├── tenant_id
├── name
├── email
├── password_hash
├── role
├── active
├── created_at
└── updated_at
```

Roles iniciais:

```text id="20f6ab"
MASTER
```

Futuramente:

```text id="7iq7im"
ADMIN
EDITOR
```

---

# 12. Autenticação

Utilizar:

**Spring Security + JWT**

Fluxo:

```text id="5skmll"
Email + senha
     ↓
Authentication
     ↓
Spring Security
     ↓
JWT
     ↓
Frontend
```

O backend deverá validar:

* assinatura;
* expiração;
* usuário;
* tenant;
* role;
* status do usuário.

Senhas deverão ser armazenadas usando hash seguro.

---

# 13. Frontend público

Estrutura:

```text id="byxj5a"
/                     → Home
/produtos             → Catálogo
/produtos/{categoria} → Categoria
/produtos/{categoria}/{produto}
```

A experiência deverá ser **mobile-first**.

---

# 14. Home

A Home será formada por blocos configuráveis.

```text id="z6q0c8"
Home
│
├── Hero / Banners
├── Categorias em destaque
├── Produtos em destaque
├── Banner promocional
├── Depoimentos
├── CTA WhatsApp
└── Footer
```

O Master poderá:

* ativar;
* desativar;
* ordenar;
* selecionar conteúdo.

Não será criado um construtor livre de páginas.

---

# 15. Home Sections

Modelo conceitual:

```text id="f6j8s1"
HomeSection
├── id
├── tenant_id
├── type
├── display_order
├── active
├── configuration
├── created_at
└── updated_at
```

Tipos:

```text id="i3m8pr"
BANNER
CATEGORY_SHOWCASE
PRODUCT_SHOWCASE
TESTIMONIAL
CTA
```

---

# 16. Banners

Modelo:

```text id="v8d7uy"
Banner
├── id
├── tenant_id
├── title
├── desktop_image
├── mobile_image
├── link
├── active
├── display_order
├── created_at
└── updated_at
```

### Desktop

```text id="i4i8c5"
1920 × 600
```

Proporção aproximada:

```text id="l3opre"
3.2:1
```

### Mobile

```text id="5k2i7f"
1080 × 1350
```

Proporção:

```text id="x0vkgm"
4:5
```

O frontend deverá utilizar a imagem apropriada de acordo com o dispositivo.

---

# 17. Categorias

Modelo:

```text id="s0q6h0"
Category
├── id
├── tenant_id
├── name
├── slug
├── description
├── image
├── active
├── display_order
├── created_at
└── updated_at
```

Imagem:

```text id="q2yns4"
800 × 800
```

Proporção:

```text id="g7p5tz"
1:1
```

---

# 18. Produtos

Modelo:

```text id="a3c8em"
Product
├── id
├── tenant_id
├── name
├── slug
├── short_description
├── description
├── active
├── featured
├── display_order
├── created_at
└── updated_at
```

Um produto poderá pertencer a várias categorias.

```text id="q7h0b1"
Product N:N Category
```

Tabela:

```text id="c8t1dz"
product_categories
```

---

# 19. Atributos de produto

Como o sistema será genérico, não deverá existir no MVP uma estrutura como:

```text id="kfr5lz"
paper_type
size
finish
```

diretamente na tabela Product.

O sistema deverá ser preparado para atributos configuráveis futuramente.

Exemplo:

```text id="g0v8cb"
Produto
 ├── Material
 ├── Tamanho
 ├── Acabamento
 └── Cor
```

A implementação detalhada de atributos configuráveis poderá ser adicionada posteriormente.

---

# 20. Imagens de produtos

Formatos:

```text id="m0l7fz"
JPEG
PNG
WebP
```

Proporção:

```text id="t9p9ax"
1:1
```

Dimensões:

```text id="clzqgz"
mínimo: 800 × 800
máximo: 3000 × 3000
```

Tamanho máximo:

```text id="lq0x2x"
5 MB
```

---

# 21. Processamento de imagens

Upload:

```text id="4e5dby"
Imagem original
      ↓
Validação
      ↓
Processamento
      ↓
Resize
      ↓
Compressão
      ↓
WebP
      ↓
Storage
```

O sistema deverá impedir:

* MIME type inválido;
* extensão incompatível;
* imagem corrompida;
* tamanho excessivo;
* dimensões inválidas;
* proporção inválida.

---

# 22. Logo

Formatos:

```text id="w9a0ef"
SVG
PNG
WebP
```

Preferência:

```text id="qg1p1w"
SVG
```

O frontend deverá utilizar:

```text id="9ufv8t"
object-fit: contain
```

A logo não deverá ser distorcida.

---

# 23. Storage

Os arquivos serão armazenados na VPS.

Estrutura:

```text id="8c7w2e"
/storage
└── tenants
    ├── {tenant-id}
    │   ├── logo
    │   ├── banners
    │   ├── categories
    │   └── products
    │
    └── {tenant-id}
```

O banco armazenará somente metadados.

---

# 24. StorageService

Criar uma porta:

```text id="c1qj7s"
StorageService
```

Métodos conceituais:

```text id="7x9q9b"
upload()
delete()
exists()
getUrl()
```

Implementação:

```text id="5i0j7s"
LocalStorageService
```

O domínio e os casos de uso não deverão depender diretamente do filesystem.

---

# 25. WhatsApp

Cada Tenant deverá possuir:

```text id="9z2p8h"
whatsapp_number
```

Opcional:

```text id="3c2l4g"
whatsapp_message_template
```

O sistema deverá gerar uma URL de WhatsApp com contexto.

Exemplo:

```text id="c4s2qp"
Olá! Tenho interesse no produto Cartão de Visita.
Gostaria de receber mais informações.
```

---

# 26. Produtos relacionados

Na página do produto:

```text id="k7oq3h"
Produto
├── imagens
├── informações
├── categorias
├── WhatsApp
└── produtos relacionados
```

Produtos relacionados:

* deverão pertencer à mesma categoria;
* não deverão incluir o produto atual;
* deverão respeitar `active`;
* poderão ser selecionados aleatoriamente ou por regra definida posteriormente.

---

# 27. Identidade visual

Modelo:

```text id="g9i2vn"
StoreSettings
├── logo
├── primary_color
├── secondary_color
├── background_color
├── text_color
└── whatsapp_number
```

As configurações deverão ser carregadas dinamicamente.

---

# 28. Depoimentos

Modelo:

```text id="yd8q5q"
Testimonial
├── id
├── tenant_id
├── name
├── text
├── active
├── display_order
├── created_at
└── updated_at
```

Master poderá:

* criar;
* editar;
* excluir;
* ativar;
* desativar;
* ordenar.

---

# 29. Painel Master

Rotas:

```text id="3g9bzw"
/admin
/admin/produtos
/admin/categorias
/admin/banners
/admin/depoimentos
/admin/configuracoes
```

---

# 30. CRUD de produtos

Master poderá:

```text id="1v7y0v"
Criar
Visualizar
Editar
Excluir
Ativar
Desativar
Destacar
Ordenar
Associar categorias
Adicionar imagens
Excluir imagens
Ordenar imagens
```

---

# 31. CRUD de categorias

Master poderá:

```text id="yq5x4a"
Criar
Visualizar
Editar
Excluir
Ativar
Desativar
Adicionar imagem
Ordenar
```

---

# 32. CRUD de banners

Master poderá:

```text id="9mj8l5"
Criar
Editar
Excluir
Ativar
Desativar
Ordenar
Upload desktop
Upload mobile
```

---

# 33. CRUD de depoimentos

Master poderá:

```text id="5p5x8g"
Criar
Editar
Excluir
Ativar
Desativar
Ordenar
```

---

# 34. API Contract-First

Esta é uma regra arquitetural fundamental.

O backend e frontend **não deverão definir APIs independentemente**.

A fonte oficial do contrato será:

```text id="0b3h5a"
docs/api/openapi.yaml
```

Esse arquivo definirá:

* endpoints;
* métodos HTTP;
* parâmetros;
* request bodies;
* responses;
* códigos HTTP;
* schemas;
* erros;
* autenticação;
* paginação;
* convenções.

---

# 35. OpenAPI como contrato compartilhado

Fluxo:

```text id="v9p9m7"
                openapi.yaml
                     │
           ┌─────────┴─────────┐
           ▼                   ▼
     Backend Agent        Frontend Agent
           │                   │
           ▼                   ▼
     Spring Boot           API Client
           │                   │
           ▼                   ▼
       PostgreSQL           Mock API
```

O frontend poderá trabalhar sem o backend estar concluído.

---

# 36. Desenvolvimento paralelo

Cada agente deverá trabalhar em sua própria worktree.

Exemplo:

```text id="k2m8cq"
project/
project-backend/
project-frontend/
```

Branches:

```text id="7c7crz"
main

feature/backend-products
feature/frontend-products
```

---

# 37. Papel do Backend Agent

O Backend Agent deverá:

* implementar domínio;
* implementar use cases;
* implementar repositories;
* implementar controllers;
* implementar validações;
* implementar segurança;
* escrever testes;
* implementar endpoints definidos no OpenAPI.

O Backend Agent **não deverá alterar contratos silenciosamente**.

---

# 38. Papel do Frontend Agent

O Frontend Agent deverá:

* implementar páginas;
* implementar componentes;
* implementar estados;
* implementar formulários;
* implementar responsividade;
* implementar acessibilidade;
* implementar consumo da API;
* criar mocks quando necessário;
* escrever testes.

O Frontend Agent deverá trabalhar contra:

```text id="kj5h0v"
OpenAPI
```

e não contra suposições sobre o backend.

---

# 39. Quando um agente precisar de uma API que não existe

Essa regra deverá estar explícita no projeto.

Se o Frontend Agent descobrir:

> "Preciso de `GET /api/public/categories/{slug}/products`, mas esse endpoint não existe no contrato."

Ele **não deverá simplesmente criar uma chamada arbitrária**.

Deverá registrar uma solicitação de alteração.

Criar:

```text id="v0q5df"
docs/api/requests/
```

Exemplo:

```text id="0fr4h7"
docs/api/requests/REQ-001-category-products.md
```

Conteúdo:

```markdown
# REQ-001 — Produtos por categoria

## Necessidade

A página de categoria precisa listar os produtos
associados à categoria.

## Endpoint proposto

GET /api/public/categories/{slug}/products

## Request

Path:
slug: string

## Response

{
  "items": []
}

## Motivo

Necessário para implementação da página de categoria.

## Impacto

Frontend:
- CategoryPage

Backend:
- Product module
- Category module
```

---

# 40. Processo para nova API

Quando surgir uma necessidade não mapeada:

```text id="h0m4c1"
Agente identifica necessidade
          ↓
Cria API Request
          ↓
Revisão do contrato
          ↓
OpenAPI atualizado
          ↓
Backend implementa
          ↓
Frontend implementa
          ↓
Contract Test
```

---

# 41. O agente pode propor o endpoint

Sim.

O agente poderá sugerir:

```text id="u3x8cv"
METHOD
PATH
REQUEST
RESPONSE
ERRORS
RATIONALE
```

Mas a regra será:

> **Propor endpoint ≠ alterar contrato automaticamente.**

O contrato deverá ser alterado de maneira explícita.

---

# 42. Registro de mudanças de API

Criar:

```text id="v5x3cq"
docs/api/changelog.md
```

Exemplo:

```markdown
# API Changelog

## 0.2.0

Added:
- GET /api/public/categories/{slug}/products

## 0.1.0

Initial API contract.
```

---

# 43. Regra para mudanças breaking

Alterações como:

```text id="7m0p4r"
renomear campo
remover campo
alterar tipo
alterar response
alterar comportamento
```

deverão ser consideradas **breaking changes**.

Exemplo:

```json id="3s7w0h"
"name": "Cartão"
```

não poderá simplesmente virar:

```json id="nh8t7z"
"productName": "Cartão"
```

sem atualizar o contrato e consumidores.

---

# 44. Compatibilidade

Sempre que possível, preferir mudanças backward-compatible.

Exemplo:

Adicionar:

```json id="3f7g2q"
"description"
```

é preferível a renomear um campo existente.

---

# 45. Mock API

O frontend deverá possuir uma estratégia de mock baseada no contrato.

```text id="f4e4df"
OpenAPI
   ↓
Mock
   ↓
Frontend
```

Isso permitirá desenvolver:

```text id="o6y3gt"
Home
Produtos
Categorias
Produto
Admin
```

antes da implementação completa do backend.

---

# 46. Client do Frontend

O frontend deverá possuir uma camada:

```text id="0pt5i7"
API Client
```

Arquitetura:

```text id="sp8qfw"
React Component
      ↓
Feature Service
      ↓
API Client
      ↓
HTTP
```

Componentes não deverão realizar chamadas HTTP diretamente de maneira espalhada pelo código.

---

# 47. TDD

Todo comportamento de negócio deverá seguir:

```text id="h8g3c4"
RED
 ↓
teste falha
 ↓
GREEN
 ↓
implementação
 ↓
REFACTOR
```

Nenhuma regra de negócio deverá ser adicionada sem teste correspondente.

---

# 48. Backend TDD

Ordem preferencial:

```text id="6z3zq0"
Use Case Test
      ↓
Domain
      ↓
Implementation
      ↓
Integration Test
      ↓
Controller
```

Testar:

* regras;
* validações;
* autorização;
* tenant;
* persistência;
* erros.

---

# 49. Frontend TDD

Testar:

* componentes;
* interações;
* formulários;
* estados;
* loading;
* erro;
* empty state;
* responsividade quando aplicável;
* comportamento de acessibilidade.

---

# 50. Testes de integração

Utilizar:

**Testcontainers + PostgreSQL**

Testar:

```text id="9fxn2r"
Database
Repository
Transaction
Controller
Security
Tenant isolation
```

---

# 51. Contract Tests

Os contratos da API deverão possuir testes que garantam que:

```text id="w3zj0a"
OpenAPI
     ≈
API real
```

O backend não poderá retornar uma estrutura incompatível com o contrato.

Exemplo:

Se OpenAPI define:

```json id="3o0fj2"
{
  "id": "uuid",
  "name": "string"
}
```

a implementação deverá respeitar esse formato.

---

# 52. E2E

Fluxo principal:

```text id="8f8x8n"
Login Master
     ↓
Criar categoria
     ↓
Upload imagem
     ↓
Criar produto
     ↓
Associar categoria
     ↓
Publicar
     ↓
Acessar loja
     ↓
Encontrar categoria
     ↓
Abrir produto
     ↓
Produtos relacionados
     ↓
WhatsApp
```

---

# 53. Segurança

Implementar:

* validação de entrada;
* autenticação;
* autorização;
* isolamento de tenant;
* proteção contra SQL Injection;
* proteção contra XSS;
* proteção contra path traversal;
* rate limit no login;
* validação de upload;
* headers de segurança;
* JWT seguro.

---

# 54. Imagens e segurança

O sistema não deverá confiar apenas na extensão.

Exemplo:

```text id="x7xj3q"
arquivo.jpg
```

não significa necessariamente que seja JPEG.

O sistema deverá verificar o conteúdo/MIME real do arquivo.

Também deverá gerar nomes internos únicos.

Nunca utilizar diretamente o nome enviado pelo usuário como caminho no filesystem.

---

# 55. Responsividade

Breakpoints deverão considerar:

```text id="ysu9on"
320px
375px
390px
430px
768px
1024px
1280px
1440px
1920px
```

O sistema deverá ser desenvolvido mobile-first.

---

# 56. SEO

Cada loja deverá possuir:

* title;
* description;
* canonical;
* Open Graph;
* favicon;
* sitemap;
* robots.txt;
* URLs amigáveis.

Produtos deverão possuir metadata dinâmica.

---

# 57. Performance

Objetivos:

* imagens otimizadas;
* lazy loading;
* WebP/AVIF;
* cache HTTP;
* SSR/SSG quando apropriado;
* evitar N+1;
* paginação;
* índices no PostgreSQL.

---

# 58. Cache

Redis **não será utilizado no MVP**.

A arquitetura poderá receber Redis posteriormente.

Inicialmente:

```text id="r0b6kc"
Next.js
   ↓
Spring Boot
   ↓
PostgreSQL
```

---

# 59. Infraestrutura

Docker Compose:

```text id="d2g8jb"
services:

  nginx
  frontend
  backend
  postgres
```

Volumes:

```text id="v4w9x1"
postgres_data
application_storage
```

---

# 60. Nginx

Responsabilidades:

* HTTPS;
* reverse proxy;
* frontend;
* backend;
* arquivos estáticos;
* headers;
* compressão;
* cache.

---

# 61. Backup

Backup deverá incluir:

```text id="1w4g9k"
PostgreSQL
Storage
Configurações
```

O backup não poderá existir somente na VPS.

---

# 62. CI/CD

GitHub Actions:

```text id="m6r0a5"
Push
 ↓
Lint
 ↓
Unit Tests
 ↓
Integration Tests
 ↓
Build
 ↓
Docker
 ↓
Deploy
```

Pull Request:

```text id="7s7d9n"
PR
 ↓
Lint
 ↓
Tests
 ↓
Contract validation
 ↓
Build
```

---

# 63. Estrutura do repositório

```text id="f5q8q6"
project/
│
├── backend/
├── frontend/
│
├── docs/
│   │
│   ├── product/
│   │   └── requirements.md
│   │
│   ├── architecture/
│   │   ├── architecture.md
│   │   ├── multi-tenancy.md
│   │   └── storage.md
│   │
│   ├── api/
│   │   ├── openapi.yaml
│   │   ├── conventions.md
│   │   ├── changelog.md
│   │   └── requests/
│   │
│   └── testing/
│       └── testing-strategy.md
│
├── docker-compose.yml
└── README.md
```

---

# 64. EPIC — Setup

### TASK 64.01 — Criar repositório

### TASK 64.02 — Configurar Spring Boot

### TASK 64.03 — Configurar Next.js

### TASK 64.04 — Configurar TypeScript

### TASK 64.05 — Configurar Tailwind

### TASK 64.06 — Configurar Docker

### TASK 64.07 — Configurar Docker Compose

### TASK 64.08 — Configurar ESLint

### TASK 64.09 — Configurar Prettier

### TASK 64.10 — Configurar ambientes

---

# 65. EPIC — Contract

### TASK 65.01 — Criar OpenAPI

### TASK 65.02 — Definir convenções REST

### TASK 65.03 — Definir formato de erros

### TASK 65.04 — Definir paginação

### TASK 65.05 — Definir autenticação

### TASK 65.06 — Criar mock

### TASK 65.07 — Criar validação do contrato

### TASK 65.08 — Criar API changelog

### TASK 65.09 — Criar processo de API Requests

---

# 66. EPIC — Tenant

### TASK 66.01 — Tenant Entity

### TASK 66.02 — Tenant Repository

### TASK 66.03 — Tenant Context

### TASK 66.04 — Tenant Resolution

### TASK 66.05 — Tenant Isolation

### TASK 66.06 — Testes de isolamento

---

# 67. EPIC — Authentication

### TASK 67.01 — User Entity

### TASK 67.02 — Password Hash

### TASK 67.03 — Login

### TASK 67.04 — JWT

### TASK 67.05 — Security Filter

### TASK 67.06 — Authorization

### TASK 67.07 — Testes

---

# 68. EPIC — Storage

### TASK 68.01 — StorageService

### TASK 68.02 — LocalStorageService

### TASK 68.03 — Upload

### TASK 68.04 — Delete

### TASK 68.05 — MIME validation

### TASK 68.06 — Size validation

### TASK 68.07 — Dimension validation

### TASK 68.08 — Image processing

### TASK 68.09 — WebP conversion

### TASK 68.10 — Unique filenames

### TASK 68.11 — Tenant isolation

### TASK 68.12 — Orphan cleanup

### TASK 68.13 — Tests

---

# 69. EPIC — Categories

### TASK 69.01 — Entity

### TASK 69.02 — Repository

### TASK 69.03 — Create Use Case

### TASK 69.04 — Update Use Case

### TASK 69.05 — Delete Use Case

### TASK 69.06 — List Use Case

### TASK 69.07 — Image

### TASK 69.08 — REST API

### TASK 69.09 — Tests

---

# 70. EPIC — Products

### TASK 70.01 — Entity

### TASK 70.02 — Repository

### TASK 70.03 — Create Use Case

### TASK 70.04 — Update Use Case

### TASK 70.05 — Delete Use Case

### TASK 70.06 — Get Use Case

### TASK 70.07 — List Use Case

### TASK 70.08 — Categories relationship

### TASK 70.09 — Images

### TASK 70.10 — Featured

### TASK 70.11 — Ordering

### TASK 70.12 — Related Products

### TASK 70.13 — REST API

### TASK 70.14 — Tests

---

# 71. EPIC — Banners

### TASK 71.01 — Entity

### TASK 71.02 — CRUD

### TASK 71.03 — Desktop image

### TASK 71.04 — Mobile image

### TASK 71.05 — Ordering

### TASK 71.06 — Activation

### TASK 71.07 — REST API

### TASK 71.08 — Tests

---

# 72. EPIC — Testimonials

### TASK 72.01 — Entity

### TASK 72.02 — CRUD

### TASK 72.03 — Activation

### TASK 72.04 — Ordering

### TASK 72.05 — REST API

### TASK 72.06 — Tests

---

# 73. EPIC — Store Settings

### TASK 73.01 — Entity

### TASK 73.02 — Logo

### TASK 73.03 — Colors

### TASK 73.04 — WhatsApp

### TASK 73.05 — REST API

### TASK 73.06 — Tests

---

# 74. EPIC — Home

### TASK 74.01 — HomeSection

### TASK 74.02 — Section ordering

### TASK 74.03 — Section activation

### TASK 74.04 — Banner section

### TASK 74.05 — Category section

### TASK 74.06 — Product section

### TASK 74.07 — Testimonial section

### TASK 74.08 — CTA section

### TASK 74.09 — REST API

### TASK 74.10 — Tests

---

# 75. EPIC — Frontend público

### TASK 75.01 — Layout

### TASK 75.02 — Navbar

### TASK 75.03 — Footer

### TASK 75.04 — Home

### TASK 75.05 — Banner

### TASK 75.06 — Categories

### TASK 75.07 — Featured products

### TASK 75.08 — Testimonials

### TASK 75.09 — CTA

### TASK 75.10 — Catalog

### TASK 75.11 — Category page

### TASK 75.12 — Product page

### TASK 75.13 — Related products

### TASK 75.14 — WhatsApp

---

# 76. EPIC — Admin Frontend

### TASK 76.01 — Login

### TASK 76.02 — Dashboard

### TASK 76.03 — Products

### TASK 76.04 — Product form

### TASK 76.05 — Product images

### TASK 76.06 — Categories

### TASK 76.07 — Banners

### TASK 76.08 — Testimonials

### TASK 76.09 — Settings

### TASK 76.10 — Image upload UI

### TASK 76.11 — Error states

### TASK 76.12 — Loading states

### TASK 76.13 — Empty states

---

# 77. EPIC — Integration

### TASK 77.01 — Frontend API Client

### TASK 77.02 — Generated types

### TASK 77.03 — Mock API

### TASK 77.04 — Replace mocks with real API

### TASK 77.05 — Contract tests

### TASK 77.06 — E2E

### TASK 77.07 — Cross-tenant tests

---

# 78. EPIC — SEO

### TASK 78.01 — Metadata

### TASK 78.02 — Open Graph

### TASK 78.03 — Canonical

### TASK 78.04 — Sitemap

### TASK 78.05 — Robots

### TASK 78.06 — Dynamic product metadata

---

# 79. EPIC — Security

### TASK 79.01 — Input validation

### TASK 79.02 — Rate limit

### TASK 79.03 — JWT security

### TASK 79.04 — Authorization

### TASK 79.05 — Tenant isolation

### TASK 79.06 — Upload security

### TASK 79.07 — Path traversal

### TASK 79.08 — Security headers

### TASK 79.09 — Security tests

---

# 80. EPIC — Infrastructure

### TASK 80.01 — VPS setup

### TASK 80.02 — Docker production

### TASK 80.03 — Nginx

### TASK 80.04 — HTTPS

### TASK 80.05 — Persistent storage

### TASK 80.06 — PostgreSQL backup

### TASK 80.07 — Storage backup

### TASK 80.08 — Monitoring

### TASK 80.09 — Logging

### TASK 80.10 — CI/CD

### TASK 80.11 — Production deployment

---

# 81. Definition of Done

Uma task somente estará concluída quando:

* implementação concluída;
* testes implementados;
* testes passando;
* validação implementada;
* tratamento de erros implementado;
* segurança considerada;
* documentação atualizada quando necessário;
* contrato atualizado quando necessário;
* code review concluído.

---

# 82. Definition of Done — API

Uma API só estará concluída quando:

```text id="qf1z7m"
OpenAPI
   ↓
Implementação
   ↓
Unit Tests
   ↓
Integration Tests
   ↓
Contract Tests
   ↓
Frontend integrado
```

---

# 83. Definition of Done — Frontend

Uma funcionalidade só estará concluída quando:

* funcionar com mock;
* funcionar com API real;
* possuir loading;
* possuir erro;
* possuir empty state;
* for responsiva;
* possuir acessibilidade básica;
* possuir testes apropriados.

---

# 84. Regra de ouro para os agentes

Esta regra deverá estar no `AGENTS.md` do projeto:

```text id="9d7w5v"
1. Nunca invente um endpoint silenciosamente.

2. Consulte docs/api/openapi.yaml antes de consumir ou
   implementar uma API.

3. Se o endpoint necessário não existir:
   - registre uma API Request;
   - proponha método;
   - proponha path;
   - proponha request;
   - proponha response;
   - explique a necessidade.

4. Não altere o contrato sem registrar a mudança.

5. Alterações breaking precisam ser explicitamente identificadas.

6. O frontend deve poder funcionar com Mock API.

7. O backend deve implementar exatamente o contrato.

8. Toda regra de negócio nova deve possuir teste.

9. Nunca ignore tenant_id em operações multi-tenant.

10. Nunca permita que dados de um tenant sejam acessados
    por outro tenant.
```

---

# 85. Fluxo definitivo dos agentes

Esse passa a ser o fluxo oficial:

```text id="6z9j6j"
                  PRODUCT SPEC
                       │
                       ▼
               ARCHITECT / CONTRACT
                       │
                       ▼
                 openapi.yaml
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
      BACKEND AGENT        FRONTEND AGENT
             │                   │
        TDD Backend          Mock API
             │                   │
             ▼                   ▼
       Spring Boot          Next.js
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                CONTRACT TESTS
                       │
                       ▼
                    E2E
                       │
                       ▼
                    MERGE
```

E quando aparecer algo novo:

```text id="1o4j8c"
Agent precisa de endpoint
          │
          ▼
Existe no OpenAPI?
       /       \
     SIM        NÃO
      │          │
      │          ▼
      │      API Request
      │          │
      │          ▼
      │     Revisão/decisão
      │          │
      │          ▼
      │      OpenAPI
      │          │
      └────┬─────┘
           ▼
       Implementação
           │
           ▼
      Contract Tests
```


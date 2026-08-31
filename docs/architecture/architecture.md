# Backend Architecture

## Overview
A plataforma backend é desenvolvida como um **Monólito Modular** utilizando Clean Architecture / Hexagonal Architecture.

## Estrutura de Camadas
```
Controller (REST API)
    ↓
Application / Use Case (Regras de Aplicação)
    ↓
Domain (Entidades de Negócio & Value Objects)
    ↓
Ports (Interfaces de Repositórios e Serviços de Infraestrutura)
    ↓
Infrastructure (JPA Repositories, Adapters, Storage, Security)
```

## Módulos
- **tenant**: Identificação, resolução e isolamento de tenants (`Tenant`, `TenantContext`).
- **auth**: Autenticação JWT, filtros de segurança, credenciais e permissões (`User`, `Role`).
- **user**: Gestão de usuários master e administradores.
- **settings**: Configurações de loja, identidade visual e WhatsApp (`StoreSettings`).
- **category**: Categorias de produtos da vitrine (`Category`).
- **product**: Produtos, catálogo, imagens e produtos relacionados (`Product`, `ProductImage`).
- **banner**: Banners para desktop e mobile (`Banner`).
- **testimonial**: Depoimentos de clientes (`Testimonial`).
- **homepage**: Configuração dinâmica da Home e suas seções (`HomeSection`).
- **media**: Processamento, validação e armazenamento de arquivos (`StorageService`, `LocalStorageService`).
- **common**: Exceções padronizadas, tratamento global de erros RFC 7807, DTOs de paginação.

## Princípios Chave
1. **Isolamento de Tenants**: Toda entidade e consulta no banco de dados respeita estritamente o `tenant_id` fornecido pelo `TenantContext`.
2. **Contract-First**: Nenhuma alteração de endpoint é feita sem estar documentada em `docs/api/openapi.yaml` e `docs/api/changelog.md`.
3. **Desacoplamento de Storage**: O domínio depende apenas da interface `StorageService`, permitindo trocar de armazenamento local VPS para S3/MinIO no futuro sem tocar no domínio.

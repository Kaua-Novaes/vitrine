# Storage Architecture

## Abstração via Porta
Toda operação de arquivos passa pela interface `StorageService`:
- `upload(InputStream content, String tenantId, String folder, String extension, String mimeType): String`
- `delete(String fileUrl, String tenantId): void`
- `exists(String fileUrl): boolean`
- `getUrl(String relativePath): String`

## Implementação MVP: LocalStorageService
- Arquivos são armazenados no diretório da VPS: `/storage/tenants/{tenant_id}/{folder}/{uuid}.{ext}`
- Pastas padrão: `logo`, `banners`, `categories`, `products`.
- Proteções:
  - Sanitização de caminhos (prevenção contra Path Traversal).
  - Nomes de arquivo gerados via UUID (nunca utiliza o nome original do arquivo enviado pelo cliente).
  - Validação estrita de Magic Bytes / MIME Types (PNG, JPEG, WebP, SVG).
  - Limite de tamanho por arquivo (máx 5MB).

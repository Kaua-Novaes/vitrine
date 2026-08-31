# REST API Conventions

## 1. Base URL & Protocol
- Base path for Public API: `/api/public`
- Base path for Admin API: `/api/admin`
- Content Type: `application/json; charset=utf-8` (except for multipart file uploads `multipart/form-data`)

## 2. HTTP Methods & Status Codes
- `GET`: Retrieve resource(s). Status: `200 OK`
- `POST`: Create resource. Status: `201 Created` with `Location` header or resource body.
- `PUT`: Full update of a resource. Status: `200 OK`
- `PATCH`: Partial update or action (e.g. reorder). Status: `200 OK` or `204 No Content`
- `DELETE`: Remove resource. Status: `204 No Content`

## 3. Standard Error Format (RFC 7807)
```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Invalid input data",
  "instance": "/api/admin/products",
  "timestamp": "2026-08-31T01:00:00Z",
  "errors": [
    {
      "field": "name",
      "message": "Name is mandatory"
    }
  ]
}
```

## 4. Standard Pagination Format
Query parameters:
- `page`: 0-indexed page number (default: 0)
- `size`: page size (default: 20, max: 100)
- `sort`: sorting criteria (e.g. `displayOrder,asc` or `createdAt,desc`)

Response structure:
```json
{
  "content": [],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5,
  "last": false
}
```

## 5. Multi-Tenancy Resolution
- **Public API**: Tenant is resolved via Request Host / Subdomain (e.g., `lojax.plataforma.com.br`) or `X-Tenant-Slug` header in development/preview.
- **Admin API**: Tenant is strictly resolved via JWT token claims (`tenantId`). Never pass `tenant_id` as trusted request parameter or body payload.

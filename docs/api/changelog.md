# API Changelog

All notable changes to the API contract will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-31

### Added
- Initial OpenAPI 3.0.3 specification for Plataforma de Vitrines Digitais.
- Public Endpoints:
  - `GET /api/public/store`: Public store settings and visual identity.
  - `GET /api/public/home`: Dynamic home sections composition (banners, showcase, testimonials, CTA).
  - `GET /api/public/banners`: Active banners list.
  - `GET /api/public/categories`: Active categories list.
  - `GET /api/public/categories/{slug}`: Category detail by slug.
  - `GET /api/public/categories/{slug}/products`: Products by category slug with pagination.
  - `GET /api/public/products`: Public products catalog with search, filter, and pagination.
  - `GET /api/public/products/{slug}`: Product details with images, categories, and related products.
  - `GET /api/public/testimonials`: Active testimonials list.
- Admin Endpoints:
  - `POST /api/admin/auth/login`: Admin authentication returning JWT.
  - `GET /api/admin/auth/me`: Current user session and tenant details.
  - `GET /api/admin/settings` & `PUT /api/admin/settings`: Manage store settings.
  - `GET`, `POST`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}`, `PATCH /{id}/reorder` for:
    - `/api/admin/categories`
    - `/api/admin/products`
    - `/api/admin/banners`
    - `/api/admin/testimonials`
  - `GET /api/admin/home/sections` & `PUT /api/admin/home/sections`: Manage home sections ordering and active status.
  - `POST /api/admin/products/{id}/images` & `DELETE /api/admin/products/{id}/images/{imageId}`: Product images management.
  - `POST /api/admin/media/upload` & `DELETE /api/admin/media`: File media upload and delete.

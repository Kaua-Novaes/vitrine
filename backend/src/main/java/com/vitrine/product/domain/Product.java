package com.vitrine.product.domain;

import com.vitrine.tenant.domain.Tenant;
import lombok.Getter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
public class Product {
    private final UUID id;
    private final UUID tenantId;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private boolean featured;
    private int displayOrder;
    private boolean active;
    private List<UUID> categoryIds;
    private List<ProductImage> images;
    private final Instant createdAt;
    private Instant updatedAt;

    public Product(UUID id, UUID tenantId, String name, String slug, String shortDescription, String description,
                   boolean featured, int displayOrder, boolean active, List<UUID> categoryIds, List<ProductImage> images,
                   Instant createdAt, Instant updatedAt) {
        if (id == null) throw new IllegalArgumentException("Product ID é obrigatório");
        if (tenantId == null) throw new IllegalArgumentException("Tenant ID é obrigatório");
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome do produto é obrigatório");
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException("Slug do produto é obrigatório");

        this.id = id;
        this.tenantId = tenantId;
        this.name = name.trim();
        this.slug = Tenant.normalizeSlug(slug);
        this.shortDescription = shortDescription;
        this.description = description;
        this.featured = featured;
        this.displayOrder = displayOrder;
        this.active = active;
        this.categoryIds = categoryIds != null ? new ArrayList<>(categoryIds) : new ArrayList<>();
        this.images = images != null ? new ArrayList<>(images) : new ArrayList<>();
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static Product create(UUID id, UUID tenantId, String name, String slug, String shortDescription,
                                 String description, boolean featured, int displayOrder, boolean active, List<UUID> categoryIds) {
        return new Product(
                id != null ? id : UUID.randomUUID(),
                tenantId,
                name,
                slug,
                shortDescription,
                description,
                featured,
                displayOrder,
                active,
                categoryIds,
                new ArrayList<>(),
                Instant.now(),
                Instant.now()
        );
    }

    public void update(String name, String slug, String shortDescription, String description,
                       boolean featured, int displayOrder, boolean active, List<UUID> categoryIds) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome do produto é obrigatório");
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException("Slug do produto é obrigatório");

        this.name = name.trim();
        this.slug = Tenant.normalizeSlug(slug);
        this.shortDescription = shortDescription;
        this.description = description;
        this.featured = featured;
        this.displayOrder = displayOrder;
        this.active = active;
        this.categoryIds = categoryIds != null ? new ArrayList<>(categoryIds) : new ArrayList<>();
        this.updatedAt = Instant.now();
    }

    public void setImages(List<ProductImage> images) {
        this.images = images != null ? new ArrayList<>(images) : new ArrayList<>();
    }

    public String getPrimaryImageUrl() {
        if (images != null && !images.isEmpty()) {
            return images.get(0).getImageUrl();
        }
        return null;
    }
}

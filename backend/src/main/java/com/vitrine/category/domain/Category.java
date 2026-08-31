package com.vitrine.category.domain;

import com.vitrine.tenant.domain.Tenant;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class Category {
    private final UUID id;
    private final UUID tenantId;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private int displayOrder;
    private boolean active;
    private final Instant createdAt;
    private Instant updatedAt;

    public Category(UUID id, UUID tenantId, String name, String slug, String description, String imageUrl, int displayOrder, boolean active, Instant createdAt, Instant updatedAt) {
        if (id == null) throw new IllegalArgumentException("Category ID é obrigatório");
        if (tenantId == null) throw new IllegalArgumentException("Tenant ID é obrigatório");
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome da categoria é obrigatório");
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException("Slug da categoria é obrigatório");

        this.id = id;
        this.tenantId = tenantId;
        this.name = name.trim();
        this.slug = Tenant.normalizeSlug(slug);
        this.description = description;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static Category create(UUID id, UUID tenantId, String name, String slug, String description, String imageUrl, int displayOrder, boolean active) {
        return new Category(
                id != null ? id : UUID.randomUUID(),
                tenantId,
                name,
                slug,
                description,
                imageUrl,
                displayOrder,
                active,
                Instant.now(),
                Instant.now()
        );
    }

    public void update(String name, String slug, String description, String imageUrl, int displayOrder, boolean active) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome da categoria é obrigatório");
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException("Slug da categoria é obrigatório");

        this.name = name.trim();
        this.slug = Tenant.normalizeSlug(slug);
        this.description = description;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.active = active;
        this.updatedAt = Instant.now();
    }
}

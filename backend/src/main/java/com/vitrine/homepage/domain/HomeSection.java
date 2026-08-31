package com.vitrine.homepage.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class HomeSection {
    private final UUID id;
    private final UUID tenantId;
    private HomeSectionType type;
    private int displayOrder;
    private boolean active;
    private String configuration;
    private final Instant createdAt;
    private Instant updatedAt;

    public HomeSection(UUID id, UUID tenantId, HomeSectionType type, int displayOrder, boolean active, String configuration, Instant createdAt, Instant updatedAt) {
        if (id == null) throw new IllegalArgumentException("HomeSection ID é obrigatório");
        if (tenantId == null) throw new IllegalArgumentException("Tenant ID é obrigatório");
        if (type == null) throw new IllegalArgumentException("Tipo da seção é obrigatório");

        this.id = id;
        this.tenantId = tenantId;
        this.type = type;
        this.displayOrder = displayOrder;
        this.active = active;
        this.configuration = configuration;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static HomeSection create(UUID id, UUID tenantId, HomeSectionType type, int displayOrder, boolean active, String configuration) {
        return new HomeSection(
                id != null ? id : UUID.randomUUID(),
                tenantId,
                type,
                displayOrder,
                active,
                configuration,
                Instant.now(),
                Instant.now()
        );
    }
}

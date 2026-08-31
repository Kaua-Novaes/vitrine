package com.vitrine.testimonial.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class Testimonial {
    private final UUID id;
    private final UUID tenantId;
    private String name;
    private String text;
    private int displayOrder;
    private boolean active;
    private final Instant createdAt;
    private Instant updatedAt;

    public Testimonial(UUID id, UUID tenantId, String name, String text, int displayOrder, boolean active, Instant createdAt, Instant updatedAt) {
        if (id == null) throw new IllegalArgumentException("Testimonial ID é obrigatório");
        if (tenantId == null) throw new IllegalArgumentException("Tenant ID é obrigatório");
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome é obrigatório");
        if (text == null || text.isBlank()) throw new IllegalArgumentException("Texto é obrigatório");

        this.id = id;
        this.tenantId = tenantId;
        this.name = name.trim();
        this.text = text.trim();
        this.displayOrder = displayOrder;
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static Testimonial create(UUID id, UUID tenantId, String name, String text, int displayOrder, boolean active) {
        return new Testimonial(
                id != null ? id : UUID.randomUUID(),
                tenantId,
                name,
                text,
                displayOrder,
                active,
                Instant.now(),
                Instant.now()
        );
    }

    public void update(String name, String text, int displayOrder, boolean active) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome é obrigatório");
        if (text == null || text.isBlank()) throw new IllegalArgumentException("Texto é obrigatório");

        this.name = name.trim();
        this.text = text.trim();
        this.displayOrder = displayOrder;
        this.active = active;
        this.updatedAt = Instant.now();
    }
}

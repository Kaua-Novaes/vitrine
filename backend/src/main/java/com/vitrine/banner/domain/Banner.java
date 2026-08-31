package com.vitrine.banner.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class Banner {
    private final UUID id;
    private final UUID tenantId;
    private String title;
    private String desktopImageUrl;
    private String mobileImageUrl;
    private String linkUrl;
    private int displayOrder;
    private boolean active;
    private final Instant createdAt;
    private Instant updatedAt;

    public Banner(UUID id, UUID tenantId, String title, String desktopImageUrl, String mobileImageUrl, String linkUrl, int displayOrder, boolean active, Instant createdAt, Instant updatedAt) {
        if (id == null) throw new IllegalArgumentException("Banner ID é obrigatório");
        if (tenantId == null) throw new IllegalArgumentException("Tenant ID é obrigatório");
        if (title == null || title.isBlank()) throw new IllegalArgumentException("Título é obrigatório");
        if (desktopImageUrl == null || desktopImageUrl.isBlank()) throw new IllegalArgumentException("Imagem desktop é obrigatória");
        if (mobileImageUrl == null || mobileImageUrl.isBlank()) throw new IllegalArgumentException("Imagem mobile é obrigatória");

        this.id = id;
        this.tenantId = tenantId;
        this.title = title.trim();
        this.desktopImageUrl = desktopImageUrl;
        this.mobileImageUrl = mobileImageUrl;
        this.linkUrl = linkUrl;
        this.displayOrder = displayOrder;
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static Banner create(UUID id, UUID tenantId, String title, String desktopImageUrl, String mobileImageUrl, String linkUrl, int displayOrder, boolean active) {
        return new Banner(
                id != null ? id : UUID.randomUUID(),
                tenantId,
                title,
                desktopImageUrl,
                mobileImageUrl,
                linkUrl,
                displayOrder,
                active,
                Instant.now(),
                Instant.now()
        );
    }

    public void update(String title, String desktopImageUrl, String mobileImageUrl, String linkUrl, int displayOrder, boolean active) {
        if (title == null || title.isBlank()) throw new IllegalArgumentException("Título é obrigatório");
        if (desktopImageUrl == null || desktopImageUrl.isBlank()) throw new IllegalArgumentException("Imagem desktop é obrigatória");
        if (mobileImageUrl == null || mobileImageUrl.isBlank()) throw new IllegalArgumentException("Imagem mobile é obrigatória");

        this.title = title.trim();
        this.desktopImageUrl = desktopImageUrl;
        this.mobileImageUrl = mobileImageUrl;
        this.linkUrl = linkUrl;
        this.displayOrder = displayOrder;
        this.active = active;
        this.updatedAt = Instant.now();
    }
}

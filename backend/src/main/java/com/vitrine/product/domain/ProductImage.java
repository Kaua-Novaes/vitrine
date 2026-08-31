package com.vitrine.product.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class ProductImage {
    private final UUID id;
    private final UUID productId;
    private final UUID tenantId;
    private String imageUrl;
    private int displayOrder;
    private final Instant createdAt;

    public ProductImage(UUID id, UUID productId, UUID tenantId, String imageUrl, int displayOrder, Instant createdAt) {
        if (id == null) throw new IllegalArgumentException("ID da imagem é obrigatório");
        if (imageUrl == null || imageUrl.isBlank()) throw new IllegalArgumentException("URL da imagem é obrigatória");

        this.id = id;
        this.productId = productId;
        this.tenantId = tenantId;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public static ProductImage create(UUID id, UUID productId, UUID tenantId, String imageUrl, int displayOrder) {
        return new ProductImage(
                id != null ? id : UUID.randomUUID(),
                productId,
                tenantId,
                imageUrl,
                displayOrder,
                Instant.now()
        );
    }
}

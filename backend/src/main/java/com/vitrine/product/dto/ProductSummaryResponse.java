package com.vitrine.product.dto;

import com.vitrine.product.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse {
    private UUID id;
    private String name;
    private String slug;
    private String shortDescription;
    private String primaryImageUrl;
    private boolean featured;
    private int displayOrder;
    private boolean active;

    public static ProductSummaryResponse fromDomain(Product product) {
        return ProductSummaryResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .primaryImageUrl(product.getPrimaryImageUrl())
                .featured(product.isFeatured())
                .displayOrder(product.getDisplayOrder())
                .active(product.isActive())
                .build();
    }
}

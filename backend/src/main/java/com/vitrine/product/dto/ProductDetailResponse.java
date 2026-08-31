package com.vitrine.product.dto;

import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.product.domain.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private UUID id;
    private String name;
    private String slug;
    private String shortDescription;
    private String description;
    private boolean featured;
    private int displayOrder;
    private boolean active;
    private List<ProductImageDto> images;
    private List<CategoryResponse> categories;
    private List<ProductSummaryResponse> relatedProducts;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductImageDto {
        private UUID id;
        private String imageUrl;
        private int displayOrder;
    }

    public static ProductDetailResponse fromDomain(Product product, List<CategoryResponse> categories, List<ProductSummaryResponse> relatedProducts) {
        List<ProductImageDto> imageDtos = product.getImages() != null ? product.getImages().stream()
                .map(img -> new ProductImageDto(img.getId(), img.getImageUrl(), img.getDisplayOrder()))
                .toList() : List.of();

        return ProductDetailResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .shortDescription(product.getShortDescription())
                .description(product.getDescription())
                .featured(product.isFeatured())
                .displayOrder(product.getDisplayOrder())
                .active(product.isActive())
                .images(imageDtos)
                .categories(categories)
                .relatedProducts(relatedProducts)
                .build();
    }
}

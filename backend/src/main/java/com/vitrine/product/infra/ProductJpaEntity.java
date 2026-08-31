package com.vitrine.product.infra;

import com.vitrine.category.infra.CategoryJpaEntity;
import com.vitrine.product.domain.Product;
import com.vitrine.product.domain.ProductImage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "products", uniqueConstraints = {
        @UniqueConstraint(name = "uk_products_tenant_slug", columnNames = {"tenant_id", "slug"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductJpaEntity {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String slug;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean active;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "product_categories",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<CategoryJpaEntity> categories = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("displayOrder ASC")
    private List<ProductImageJpaEntity> images = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Product toDomain() {
        List<UUID> categoryIds = categories != null ? categories.stream().map(CategoryJpaEntity::getId).toList() : List.of();
        List<ProductImage> domainImages = images != null ? images.stream().map(ProductImageJpaEntity::toDomain).toList() : List.of();

        return new Product(
                id,
                tenantId,
                name,
                slug,
                shortDescription,
                description,
                featured,
                displayOrder,
                active,
                categoryIds,
                domainImages,
                createdAt,
                updatedAt
        );
    }
}

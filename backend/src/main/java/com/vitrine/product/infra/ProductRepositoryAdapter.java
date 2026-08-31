package com.vitrine.product.infra;

import com.vitrine.category.infra.CategoryJpaEntity;
import com.vitrine.category.infra.CategoryJpaRepository;
import com.vitrine.product.domain.Product;
import com.vitrine.product.domain.ProductImage;
import com.vitrine.product.port.ProductRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProductRepositoryAdapter implements ProductRepositoryPort {

    private final ProductJpaRepository productJpaRepository;
    private final CategoryJpaRepository categoryJpaRepository;

    @Override
    public Product save(Product product) {
        List<CategoryJpaEntity> categories = product.getCategoryIds() != null && !product.getCategoryIds().isEmpty()
                ? categoryJpaRepository.findAllById(product.getCategoryIds())
                : List.of();

        ProductJpaEntity entity = new ProductJpaEntity(
                product.getId(),
                product.getTenantId(),
                product.getName(),
                product.getSlug(),
                product.getShortDescription(),
                product.getDescription(),
                product.isFeatured(),
                product.getDisplayOrder(),
                product.isActive(),
                categories,
                null,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );

        if (product.getImages() != null) {
            List<ProductImageJpaEntity> imageEntities = product.getImages().stream()
                    .map(img -> new ProductImageJpaEntity(
                            img.getId(),
                            entity,
                            product.getTenantId(),
                            img.getImageUrl(),
                            img.getDisplayOrder(),
                            img.getCreatedAt()
                    ))
                    .toList();
            entity.setImages(imageEntities);
        }

        ProductJpaEntity saved = productJpaRepository.save(entity);
        return saved.toDomain();
    }

    @Override
    public Optional<Product> findByIdAndTenantId(UUID id, UUID tenantId) {
        return productJpaRepository.findByIdAndTenantId(id, tenantId).map(ProductJpaEntity::toDomain);
    }

    @Override
    public Optional<Product> findBySlugAndTenantId(String slug, UUID tenantId) {
        return productJpaRepository.findBySlugAndTenantId(slug, tenantId).map(ProductJpaEntity::toDomain);
    }

    @Override
    public Page<Product> findAllByTenantId(UUID tenantId, String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return productJpaRepository.findAllByTenantId(tenantId, pageable).map(ProductJpaEntity::toDomain);
        }
        return productJpaRepository.searchAdminProducts(tenantId, search.trim(), pageable).map(ProductJpaEntity::toDomain);
    }

    @Override
    public Page<Product> findPublicProducts(UUID tenantId, String search, String categorySlug, Pageable pageable) {
        boolean hasSearch = search != null && !search.trim().isEmpty();
        boolean hasCategory = categorySlug != null && !categorySlug.trim().isEmpty();

        if (hasSearch && hasCategory) {
            return productJpaRepository.searchPublicProductsByCategory(tenantId, search.trim(), categorySlug.trim(), pageable).map(ProductJpaEntity::toDomain);
        } else if (hasSearch) {
            return productJpaRepository.searchPublicProducts(tenantId, search.trim(), pageable).map(ProductJpaEntity::toDomain);
        } else if (hasCategory) {
            return productJpaRepository.findPublicProductsByCategory(tenantId, categorySlug.trim(), pageable).map(ProductJpaEntity::toDomain);
        } else {
            return productJpaRepository.findAllByTenantIdAndActiveTrue(tenantId, pageable).map(ProductJpaEntity::toDomain);
        }
    }

    @Override
    public List<Product> findFeaturedProducts(UUID tenantId) {
        return productJpaRepository.findTop10ByTenantIdAndActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc(tenantId).stream()
                .map(ProductJpaEntity::toDomain)
                .toList();
    }

    @Override
    public List<Product> findRelatedProducts(UUID tenantId, UUID productId, List<UUID> categoryIds, int limit) {
        if (categoryIds == null || categoryIds.isEmpty()) return List.of();
        return productJpaRepository.findRelatedProducts(tenantId, productId, categoryIds, PageRequest.of(0, limit)).stream()
                .map(ProductJpaEntity::toDomain)
                .toList();
    }

    @Override
    public void deleteByIdAndTenantId(UUID id, UUID tenantId) {
        productJpaRepository.deleteByIdAndTenantId(id, tenantId);
    }

    @Override
    public boolean existsBySlugAndTenantId(String slug, UUID tenantId) {
        return productJpaRepository.existsBySlugAndTenantId(slug, tenantId);
    }
}

package com.vitrine.product.port;

import com.vitrine.product.domain.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepositoryPort {
    Product save(Product product);
    Optional<Product> findByIdAndTenantId(UUID id, UUID tenantId);
    Optional<Product> findBySlugAndTenantId(String slug, UUID tenantId);
    Page<Product> findAllByTenantId(UUID tenantId, String search, Pageable pageable);
    Page<Product> findPublicProducts(UUID tenantId, String search, String categorySlug, Pageable pageable);
    List<Product> findFeaturedProducts(UUID tenantId);
    List<Product> findRelatedProducts(UUID tenantId, UUID productId, List<UUID> categoryIds, int limit);
    void deleteByIdAndTenantId(UUID id, UUID tenantId);
    boolean existsBySlugAndTenantId(String slug, UUID tenantId);
}

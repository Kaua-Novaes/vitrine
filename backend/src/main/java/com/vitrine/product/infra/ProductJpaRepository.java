package com.vitrine.product.infra;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductJpaRepository extends JpaRepository<ProductJpaEntity, UUID> {

    Optional<ProductJpaEntity> findByIdAndTenantId(UUID id, UUID tenantId);

    Optional<ProductJpaEntity> findBySlugAndTenantId(String slug, UUID tenantId);

    boolean existsBySlugAndTenantId(String slug, UUID tenantId);

    void deleteByIdAndTenantId(UUID id, UUID tenantId);

    @Query("SELECT p FROM ProductJpaEntity p WHERE p.tenantId = :tenantId AND " +
            "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<ProductJpaEntity> findAdminProducts(@Param("tenantId") UUID tenantId, @Param("search") String search, Pageable pageable);

    @Query("SELECT DISTINCT p FROM ProductJpaEntity p LEFT JOIN p.categories c WHERE p.tenantId = :tenantId AND p.active = true AND " +
            "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:categorySlug IS NULL OR c.slug = :categorySlug)")
    Page<ProductJpaEntity> findPublicProducts(@Param("tenantId") UUID tenantId, @Param("search") String search, @Param("categorySlug") String categorySlug, Pageable pageable);

    List<ProductJpaEntity> findTop10ByTenantIdAndActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc(UUID tenantId);

    @Query("SELECT DISTINCT p FROM ProductJpaEntity p JOIN p.categories c WHERE p.tenantId = :tenantId AND p.active = true AND p.id != :productId AND c.id IN :categoryIds")
    List<ProductJpaEntity> findRelatedProducts(@Param("tenantId") UUID tenantId, @Param("productId") UUID productId, @Param("categoryIds") List<UUID> categoryIds, Pageable pageable);

    long countByTenantId(UUID tenantId);
}

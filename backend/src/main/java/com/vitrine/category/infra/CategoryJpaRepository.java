package com.vitrine.category.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryJpaRepository extends JpaRepository<CategoryJpaEntity, UUID> {
    Optional<CategoryJpaEntity> findByIdAndTenantId(UUID id, UUID tenantId);
    Optional<CategoryJpaEntity> findBySlugAndTenantId(String slug, UUID tenantId);
    List<CategoryJpaEntity> findAllByTenantIdOrderByDisplayOrderAsc(UUID tenantId);
    List<CategoryJpaEntity> findAllByTenantIdAndActiveTrueOrderByDisplayOrderAsc(UUID tenantId);
    void deleteByIdAndTenantId(UUID id, UUID tenantId);
    boolean existsBySlugAndTenantId(String slug, UUID tenantId);
}

package com.vitrine.category.port;

import com.vitrine.category.domain.Category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepositoryPort {
    Category save(Category category);
    Optional<Category> findByIdAndTenantId(UUID id, UUID tenantId);
    Optional<Category> findBySlugAndTenantId(String slug, UUID tenantId);
    List<Category> findAllByTenantId(UUID tenantId);
    List<Category> findAllActiveByTenantId(UUID tenantId);
    void deleteByIdAndTenantId(UUID id, UUID tenantId);
    boolean existsBySlugAndTenantId(String slug, UUID tenantId);
}

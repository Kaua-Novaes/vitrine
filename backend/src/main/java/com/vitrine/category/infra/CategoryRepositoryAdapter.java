package com.vitrine.category.infra;

import com.vitrine.category.domain.Category;
import com.vitrine.category.port.CategoryRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CategoryRepositoryAdapter implements CategoryRepositoryPort {

    private final CategoryJpaRepository jpaRepository;

    @Override
    public Category save(Category category) {
        CategoryJpaEntity entity = CategoryJpaEntity.fromDomain(category);
        return jpaRepository.save(entity).toDomain();
    }

    @Override
    public Optional<Category> findByIdAndTenantId(UUID id, UUID tenantId) {
        return jpaRepository.findByIdAndTenantId(id, tenantId).map(CategoryJpaEntity::toDomain);
    }

    @Override
    public Optional<Category> findBySlugAndTenantId(String slug, UUID tenantId) {
        return jpaRepository.findBySlugAndTenantId(slug, tenantId).map(CategoryJpaEntity::toDomain);
    }

    @Override
    public List<Category> findAllByTenantId(UUID tenantId) {
        return jpaRepository.findAllByTenantIdOrderByDisplayOrderAsc(tenantId).stream()
                .map(CategoryJpaEntity::toDomain)
                .toList();
    }

    @Override
    public List<Category> findAllActiveByTenantId(UUID tenantId) {
        return jpaRepository.findAllByTenantIdAndActiveTrueOrderByDisplayOrderAsc(tenantId).stream()
                .map(CategoryJpaEntity::toDomain)
                .toList();
    }

    @Override
    public void deleteByIdAndTenantId(UUID id, UUID tenantId) {
        jpaRepository.deleteByIdAndTenantId(id, tenantId);
    }

    @Override
    public boolean existsBySlugAndTenantId(String slug, UUID tenantId) {
        return jpaRepository.existsBySlugAndTenantId(slug, tenantId);
    }
}

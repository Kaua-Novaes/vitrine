package com.vitrine.tenant.infra;

import com.vitrine.tenant.domain.Tenant;
import com.vitrine.tenant.port.TenantRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TenantRepositoryAdapter implements TenantRepositoryPort {

    private final TenantJpaRepository jpaRepository;

    @Override
    public Tenant save(Tenant tenant) {
        TenantJpaEntity entity = TenantJpaEntity.fromDomain(tenant);
        return jpaRepository.save(entity).toDomain();
    }

    @Override
    public Optional<Tenant> findById(UUID id) {
        return jpaRepository.findById(id).map(TenantJpaEntity::toDomain);
    }

    @Override
    public Optional<Tenant> findBySlug(String slug) {
        return jpaRepository.findBySlug(slug).map(TenantJpaEntity::toDomain);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return jpaRepository.existsBySlug(slug);
    }
}

package com.vitrine.tenant.port;

import com.vitrine.tenant.domain.Tenant;

import java.util.Optional;
import java.util.UUID;

public interface TenantRepositoryPort {
    Tenant save(Tenant tenant);
    Optional<Tenant> findById(UUID id);
    Optional<Tenant> findBySlug(String slug);
    boolean existsBySlug(String slug);
}

package com.vitrine.tenant.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantJpaRepository extends JpaRepository<TenantJpaEntity, UUID> {
    Optional<TenantJpaEntity> findBySlug(String slug);
    boolean existsBySlug(String slug);
}

package com.vitrine.settings.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StoreSettingsJpaRepository extends JpaRepository<StoreSettingsJpaEntity, UUID> {
    Optional<StoreSettingsJpaEntity> findByTenantId(UUID tenantId);
}

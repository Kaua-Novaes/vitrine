package com.vitrine.banner.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BannerJpaRepository extends JpaRepository<BannerJpaEntity, UUID> {
    Optional<BannerJpaEntity> findByIdAndTenantId(UUID id, UUID tenantId);
    List<BannerJpaEntity> findAllByTenantIdOrderByDisplayOrderAsc(UUID tenantId);
    List<BannerJpaEntity> findAllByTenantIdAndActiveTrueOrderByDisplayOrderAsc(UUID tenantId);
    void deleteByIdAndTenantId(UUID id, UUID tenantId);
}

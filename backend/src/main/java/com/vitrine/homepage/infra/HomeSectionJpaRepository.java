package com.vitrine.homepage.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HomeSectionJpaRepository extends JpaRepository<HomeSectionJpaEntity, UUID> {
    List<HomeSectionJpaEntity> findAllByTenantIdOrderByDisplayOrderAsc(UUID tenantId);
    List<HomeSectionJpaEntity> findAllByTenantIdAndActiveTrueOrderByDisplayOrderAsc(UUID tenantId);
}

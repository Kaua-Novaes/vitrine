package com.vitrine.banner.port;

import com.vitrine.banner.domain.Banner;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BannerRepositoryPort {
    Banner save(Banner banner);
    Optional<Banner> findByIdAndTenantId(UUID id, UUID tenantId);
    List<Banner> findAllByTenantId(UUID tenantId);
    List<Banner> findAllActiveByTenantId(UUID tenantId);
    void deleteByIdAndTenantId(UUID id, UUID tenantId);
}

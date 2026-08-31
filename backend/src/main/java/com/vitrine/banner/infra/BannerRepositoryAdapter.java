package com.vitrine.banner.infra;

import com.vitrine.banner.domain.Banner;
import com.vitrine.banner.port.BannerRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class BannerRepositoryAdapter implements BannerRepositoryPort {

    private final BannerJpaRepository jpaRepository;

    @Override
    public Banner save(Banner banner) {
        BannerJpaEntity entity = BannerJpaEntity.fromDomain(banner);
        return jpaRepository.save(entity).toDomain();
    }

    @Override
    public Optional<Banner> findByIdAndTenantId(UUID id, UUID tenantId) {
        return jpaRepository.findByIdAndTenantId(id, tenantId).map(BannerJpaEntity::toDomain);
    }

    @Override
    public List<Banner> findAllByTenantId(UUID tenantId) {
        return jpaRepository.findAllByTenantIdOrderByDisplayOrderAsc(tenantId).stream()
                .map(BannerJpaEntity::toDomain)
                .toList();
    }

    @Override
    public List<Banner> findAllActiveByTenantId(UUID tenantId) {
        return jpaRepository.findAllByTenantIdAndActiveTrueOrderByDisplayOrderAsc(tenantId).stream()
                .map(BannerJpaEntity::toDomain)
                .toList();
    }

    @Override
    public void deleteByIdAndTenantId(UUID id, UUID tenantId) {
        jpaRepository.deleteByIdAndTenantId(id, tenantId);
    }
}

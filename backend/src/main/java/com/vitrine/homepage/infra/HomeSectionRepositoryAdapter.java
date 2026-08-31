package com.vitrine.homepage.infra;

import com.vitrine.homepage.domain.HomeSection;
import com.vitrine.homepage.port.HomeSectionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class HomeSectionRepositoryAdapter implements HomeSectionRepositoryPort {

    private final HomeSectionJpaRepository jpaRepository;

    @Override
    public HomeSection save(HomeSection homeSection) {
        HomeSectionJpaEntity entity = HomeSectionJpaEntity.fromDomain(homeSection);
        return jpaRepository.save(entity).toDomain();
    }

    @Override
    public List<HomeSection> findAllByTenantId(UUID tenantId) {
        return jpaRepository.findAllByTenantIdOrderByDisplayOrderAsc(tenantId).stream()
                .map(HomeSectionJpaEntity::toDomain)
                .toList();
    }

    @Override
    public List<HomeSection> findAllActiveByTenantId(UUID tenantId) {
        return jpaRepository.findAllByTenantIdAndActiveTrueOrderByDisplayOrderAsc(tenantId).stream()
                .map(HomeSectionJpaEntity::toDomain)
                .toList();
    }
}

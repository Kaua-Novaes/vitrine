package com.vitrine.homepage.port;

import com.vitrine.homepage.domain.HomeSection;

import java.util.List;
import java.util.UUID;

public interface HomeSectionRepositoryPort {
    HomeSection save(HomeSection homeSection);
    List<HomeSection> findAllByTenantId(UUID tenantId);
    List<HomeSection> findAllActiveByTenantId(UUID tenantId);
}

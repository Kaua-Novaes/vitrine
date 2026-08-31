package com.vitrine.settings.infra;

import com.vitrine.settings.domain.StoreSettings;
import com.vitrine.settings.port.StoreSettingsRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StoreSettingsRepositoryAdapter implements StoreSettingsRepositoryPort {

    private final StoreSettingsJpaRepository jpaRepository;

    @Override
    public StoreSettings save(StoreSettings settings) {
        StoreSettingsJpaEntity entity = StoreSettingsJpaEntity.fromDomain(settings);
        return jpaRepository.save(entity).toDomain();
    }

    @Override
    public Optional<StoreSettings> findByTenantId(UUID tenantId) {
        return jpaRepository.findByTenantId(tenantId).map(StoreSettingsJpaEntity::toDomain);
    }
}

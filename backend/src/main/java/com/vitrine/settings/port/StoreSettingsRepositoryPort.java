package com.vitrine.settings.port;

import com.vitrine.settings.domain.StoreSettings;

import java.util.Optional;
import java.util.UUID;

public interface StoreSettingsRepositoryPort {
    StoreSettings save(StoreSettings settings);
    Optional<StoreSettings> findByTenantId(UUID tenantId);
}

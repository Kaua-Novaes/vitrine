package com.vitrine.settings.usecase;

import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.settings.domain.StoreSettings;
import com.vitrine.settings.dto.StorePublicResponse;
import com.vitrine.settings.dto.StoreSettingsResponse;
import com.vitrine.settings.dto.UpdateStoreSettingsRequest;
import com.vitrine.settings.port.StoreSettingsRepositoryPort;
import com.vitrine.tenant.context.TenantContext;
import com.vitrine.tenant.domain.Tenant;
import com.vitrine.tenant.port.TenantRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetStoreSettingsUseCase {

    private final StoreSettingsRepositoryPort storeSettingsRepository;
    private final TenantRepositoryPort tenantRepository;

    public StorePublicResponse getPublicStore() {
        UUID tenantId = TenantContext.requireTenantId();
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Loja não encontrada."));

        StoreSettings settings = storeSettingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> StoreSettings.createDefault(tenantId));

        return StorePublicResponse.from(tenant, settings);
    }

    public StoreSettingsResponse getAdminStoreSettings() {
        UUID tenantId = TenantContext.requireTenantId();
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Loja não encontrada."));

        StoreSettings settings = storeSettingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> StoreSettings.createDefault(tenantId));

        return StoreSettingsResponse.from(tenant, settings);
    }
}

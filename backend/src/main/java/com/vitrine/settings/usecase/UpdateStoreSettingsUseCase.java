package com.vitrine.settings.usecase;

import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.settings.domain.StoreSettings;
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
public class UpdateStoreSettingsUseCase {

    private final StoreSettingsRepositoryPort storeSettingsRepository;
    private final TenantRepositoryPort tenantRepository;

    @Transactional
    public StoreSettingsResponse execute(UpdateStoreSettingsRequest request) {
        UUID tenantId = TenantContext.requireTenantId();

        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Loja não encontrada."));

        if (request.getStoreName() != null && !request.getStoreName().isBlank()) {
            tenant.update(request.getStoreName(), tenant.getSlug(), tenant.isActive());
            tenantRepository.save(tenant);
        }

        StoreSettings settings = storeSettingsRepository.findByTenantId(tenantId)
                .orElseGet(() -> StoreSettings.createDefault(tenantId));

        settings.update(
                request.getLogoUrl(),
                request.getPrimaryColor(),
                request.getSecondaryColor(),
                request.getBackgroundColor(),
                request.getTextColor(),
                request.getWhatsappNumber(),
                request.getWhatsappMessageTemplate()
        );

        StoreSettings saved = storeSettingsRepository.save(settings);
        return StoreSettingsResponse.from(tenant, saved);
    }
}

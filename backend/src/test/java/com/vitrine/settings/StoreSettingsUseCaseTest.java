package com.vitrine.settings;

import com.vitrine.settings.domain.StoreSettings;
import com.vitrine.settings.dto.StorePublicResponse;
import com.vitrine.settings.dto.StoreSettingsResponse;
import com.vitrine.settings.dto.UpdateStoreSettingsRequest;
import com.vitrine.settings.port.StoreSettingsRepositoryPort;
import com.vitrine.settings.usecase.GetStoreSettingsUseCase;
import com.vitrine.settings.usecase.UpdateStoreSettingsUseCase;
import com.vitrine.tenant.context.TenantContext;
import com.vitrine.tenant.domain.Tenant;
import com.vitrine.tenant.port.TenantRepositoryPort;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StoreSettingsUseCaseTest {

    @Mock
    private StoreSettingsRepositoryPort storeSettingsRepository;

    @Mock
    private TenantRepositoryPort tenantRepository;

    private GetStoreSettingsUseCase getStoreSettingsUseCase;
    private UpdateStoreSettingsUseCase updateStoreSettingsUseCase;

    private final UUID tenantId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId(tenantId);
        getStoreSettingsUseCase = new GetStoreSettingsUseCase(storeSettingsRepository, tenantRepository);
        updateStoreSettingsUseCase = new UpdateStoreSettingsUseCase(storeSettingsRepository, tenantRepository);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void shouldGetPublicStoreInfo() {
        Tenant tenant = Tenant.create(tenantId, "Gráfica Alpha", "grafica-alpha");
        StoreSettings settings = StoreSettings.createDefault(tenantId);

        when(tenantRepository.findById(tenantId)).thenReturn(Optional.of(tenant));
        when(storeSettingsRepository.findByTenantId(tenantId)).thenReturn(Optional.of(settings));

        StorePublicResponse response = getStoreSettingsUseCase.getPublicStore();

        assertNotNull(response);
        assertEquals("Gráfica Alpha", response.getName());
        assertEquals("grafica-alpha", response.getSlug());
    }

    @Test
    void shouldUpdateStoreSettings() {
        Tenant tenant = Tenant.create(tenantId, "Gráfica Alpha", "grafica-alpha");
        StoreSettings settings = StoreSettings.createDefault(tenantId);

        when(tenantRepository.findById(tenantId)).thenReturn(Optional.of(tenant));
        when(storeSettingsRepository.findByTenantId(tenantId)).thenReturn(Optional.of(settings));
        when(storeSettingsRepository.save(any(StoreSettings.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateStoreSettingsRequest request = UpdateStoreSettingsRequest.builder()
                .storeName("Gráfica Alpha Premium")
                .primaryColor("#FF5733")
                .whatsappNumber("11999998888")
                .build();

        StoreSettingsResponse response = updateStoreSettingsUseCase.execute(request);

        assertNotNull(response);
        assertEquals("Gráfica Alpha Premium", response.getStoreName());
        assertEquals("#FF5733", response.getPrimaryColor());
        assertEquals("11999998888", response.getWhatsappNumber());
    }
}

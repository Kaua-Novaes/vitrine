package com.vitrine.banner;

import com.vitrine.banner.domain.Banner;
import com.vitrine.banner.dto.BannerInput;
import com.vitrine.banner.dto.BannerResponse;
import com.vitrine.banner.port.BannerRepositoryPort;
import com.vitrine.banner.usecase.CreateBannerUseCase;
import com.vitrine.banner.usecase.ListBannersUseCase;
import com.vitrine.tenant.context.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BannerUseCaseTest {

    @Mock
    private BannerRepositoryPort bannerRepository;

    private CreateBannerUseCase createBannerUseCase;
    private ListBannersUseCase listBannersUseCase;

    private final UUID tenantId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId(tenantId);
        createBannerUseCase = new CreateBannerUseCase(bannerRepository);
        listBannersUseCase = new ListBannersUseCase(bannerRepository);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void shouldCreateBannerSuccessfully() {
        BannerInput input = BannerInput.builder()
                .title("Promoção de Verão")
                .desktopImageUrl("https://example.com/desktop.jpg")
                .mobileImageUrl("https://example.com/mobile.jpg")
                .linkUrl("https://example.com/promocao")
                .displayOrder(1)
                .active(true)
                .build();

        when(bannerRepository.save(any(Banner.class))).thenAnswer(inv -> inv.getArgument(0));

        BannerResponse response = createBannerUseCase.execute(input);

        assertNotNull(response);
        assertEquals("Promoção de Verão", response.getTitle());
        assertTrue(response.isActive());
    }

    @Test
    void shouldListPublicActiveBanners() {
        Banner banner = Banner.create(UUID.randomUUID(), tenantId, "Banner 1", "d.jpg", "m.jpg", null, 1, true);
        when(bannerRepository.findAllActiveByTenantId(tenantId)).thenReturn(List.of(banner));

        List<BannerResponse> responses = listBannersUseCase.listPublicActiveBanners();

        assertEquals(1, responses.size());
        assertEquals("Banner 1", responses.get(0).getTitle());
    }
}

package com.vitrine.banner.usecase;

import com.vitrine.banner.domain.Banner;
import com.vitrine.banner.dto.BannerInput;
import com.vitrine.banner.dto.BannerResponse;
import com.vitrine.banner.port.BannerRepositoryPort;
import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateBannerUseCase {

    private final BannerRepositoryPort bannerRepository;

    @Transactional
    public BannerResponse execute(BannerInput input) {
        UUID tenantId = TenantContext.requireTenantId();

        Banner banner = Banner.create(
                UUID.randomUUID(),
                tenantId,
                input.getTitle(),
                input.getDesktopImageUrl(),
                input.getMobileImageUrl(),
                input.getLinkUrl(),
                input.getDisplayOrder(),
                input.isActive()
        );

        Banner saved = bannerRepository.save(banner);
        return BannerResponse.fromDomain(saved);
    }
}

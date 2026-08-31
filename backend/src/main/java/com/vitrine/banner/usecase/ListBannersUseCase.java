package com.vitrine.banner.usecase;

import com.vitrine.banner.dto.BannerResponse;
import com.vitrine.banner.port.BannerRepositoryPort;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ListBannersUseCase {

    private final BannerRepositoryPort bannerRepository;

    public List<BannerResponse> listAdminBanners() {
        UUID tenantId = TenantContext.requireTenantId();
        return bannerRepository.findAllByTenantId(tenantId).stream()
                .map(BannerResponse::fromDomain)
                .toList();
    }

    public List<BannerResponse> listPublicActiveBanners() {
        UUID tenantId = TenantContext.requireTenantId();
        return bannerRepository.findAllActiveByTenantId(tenantId).stream()
                .map(BannerResponse::fromDomain)
                .toList();
    }
}

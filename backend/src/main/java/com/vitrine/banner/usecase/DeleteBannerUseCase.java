package com.vitrine.banner.usecase;

import com.vitrine.banner.domain.Banner;
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
public class DeleteBannerUseCase {

    private final BannerRepositoryPort bannerRepository;

    @Transactional
    public void execute(UUID id) {
        UUID tenantId = TenantContext.requireTenantId();
        Banner banner = bannerRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Banner não encontrado."));

        bannerRepository.deleteByIdAndTenantId(banner.getId(), tenantId);
    }
}

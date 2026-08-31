package com.vitrine.superadmin.service;

import com.vitrine.product.infra.ProductJpaRepository;
import com.vitrine.settings.infra.StoreSettingsJpaEntity;
import com.vitrine.settings.infra.StoreSettingsJpaRepository;
import com.vitrine.superadmin.dto.CreateTenantRequest;
import com.vitrine.superadmin.dto.SuperAdminMetricsResponse;
import com.vitrine.superadmin.dto.TenantSummaryResponse;
import com.vitrine.tenant.domain.Tenant;
import com.vitrine.tenant.infra.TenantJpaEntity;
import com.vitrine.tenant.infra.TenantJpaRepository;
import com.vitrine.user.domain.Role;
import com.vitrine.user.infra.UserJpaEntity;
import com.vitrine.user.infra.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final TenantJpaRepository tenantRepository;
    private final UserJpaRepository userRepository;
    private final ProductJpaRepository productRepository;
    private final StoreSettingsJpaRepository storeSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<TenantSummaryResponse> getAllTenants() {
        return tenantRepository.findAll().stream().map(tenant -> {
            var owner = userRepository.findAll().stream()
                    .filter(u -> u.getTenantId().equals(tenant.getId()))
                    .findFirst()
                    .orElse(null);

            long products = productRepository.countByTenantId(tenant.getId());

            return TenantSummaryResponse.builder()
                    .id(tenant.getId())
                    .name(tenant.getName())
                    .slug(tenant.getSlug())
                    .ownerName(owner != null ? owner.getName() : "Sem proprietário")
                    .ownerEmail(owner != null ? owner.getEmail() : "N/A")
                    .active(tenant.isActive())
                    .productCount(products)
                    .createdAt(tenant.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public TenantSummaryResponse createTenant(CreateTenantRequest request) {
        String slug = request.getSlug();
        if (slug == null || slug.isBlank()) {
            slug = Tenant.normalizeSlug(request.getName());
        } else {
            slug = Tenant.normalizeSlug(slug);
        }

        if (tenantRepository.existsBySlug(slug)) {
            throw new IllegalArgumentException("Subdomínio/slug '" + slug + "' já está em uso.");
        }

        Instant now = Instant.now();
        UUID tenantId = UUID.randomUUID();

        // 1. Criar Tenant
        TenantJpaEntity tenantEntity = new TenantJpaEntity(
                tenantId,
                request.getName(),
                slug,
                true,
                now,
                now
        );
        tenantRepository.save(tenantEntity);

        // 2. Criar Usuário Master
        String password = request.getOwnerPassword();
        if (password == null || password.isBlank()) {
            password = "password123";
        }

        UserJpaEntity userEntity = new UserJpaEntity(
                UUID.randomUUID(),
                tenantId,
                request.getOwnerName(),
                request.getOwnerEmail(),
                passwordEncoder.encode(password),
                Role.MASTER,
                true,
                now,
                now
        );
        userRepository.save(userEntity);

        // 3. Criar StoreSettings padrão
        StoreSettingsJpaEntity settings = new StoreSettingsJpaEntity(
                UUID.randomUUID(),
                tenantId,
                null,
                "#2563eb",
                "#1e40af",
                "#f8fafc",
                "#0f172a",
                null,
                "Olá! Tenho interesse no produto {product_name}.",
                now,
                now
        );
        storeSettingsRepository.save(settings);

        return TenantSummaryResponse.builder()
                .id(tenantId)
                .name(request.getName())
                .slug(slug)
                .ownerName(request.getOwnerName())
                .ownerEmail(request.getOwnerEmail())
                .active(true)
                .productCount(0)
                .createdAt(now)
                .build();
    }

    @Transactional
    public TenantSummaryResponse toggleTenantStatus(UUID id, boolean active) {
        TenantJpaEntity tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tenant não encontrado"));

        tenant.setActive(active);
        tenant.setUpdatedAt(Instant.now());
        tenantRepository.save(tenant);

        var owner = userRepository.findAll().stream()
                .filter(u -> u.getTenantId().equals(tenant.getId()))
                .findFirst()
                .orElse(null);

        long products = productRepository.countByTenantId(tenant.getId());

        return TenantSummaryResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .slug(tenant.getSlug())
                .ownerName(owner != null ? owner.getName() : "Sem proprietário")
                .ownerEmail(owner != null ? owner.getEmail() : "N/A")
                .active(tenant.isActive())
                .productCount(products)
                .createdAt(tenant.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public SuperAdminMetricsResponse getMetrics() {
        long totalTenants = tenantRepository.count();
        long activeTenants = tenantRepository.findAll().stream().filter(TenantJpaEntity::isActive).count();
        long totalProducts = productRepository.count();

        return SuperAdminMetricsResponse.builder()
                .totalTenants(totalTenants)
                .activeTenants(activeTenants)
                .totalProducts(totalProducts)
                .monthlyGrowthRate("+33%")
                .build();
    }
}

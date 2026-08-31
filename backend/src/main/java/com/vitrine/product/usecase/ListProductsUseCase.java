package com.vitrine.product.usecase;

import com.vitrine.common.dto.PageResponse;
import com.vitrine.product.domain.Product;
import com.vitrine.product.dto.ProductSummaryResponse;
import com.vitrine.product.port.ProductRepositoryPort;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ListProductsUseCase {

    private final ProductRepositoryPort productRepository;

    public PageResponse<ProductSummaryResponse> listAdminProducts(String search, Pageable pageable) {
        UUID tenantId = TenantContext.requireTenantId();
        Page<Product> page = productRepository.findAllByTenantId(tenantId, search, pageable);
        return PageResponse.from(page.map(ProductSummaryResponse::fromDomain));
    }

    public PageResponse<ProductSummaryResponse> listPublicProducts(String search, String categorySlug, Pageable pageable) {
        UUID tenantId = TenantContext.requireTenantId();
        Page<Product> page = productRepository.findPublicProducts(tenantId, search, categorySlug, pageable);
        return PageResponse.from(page.map(ProductSummaryResponse::fromDomain));
    }

    public List<ProductSummaryResponse> listFeaturedProducts() {
        UUID tenantId = TenantContext.requireTenantId();
        return productRepository.findFeaturedProducts(tenantId).stream()
                .map(ProductSummaryResponse::fromDomain)
                .toList();
    }
}

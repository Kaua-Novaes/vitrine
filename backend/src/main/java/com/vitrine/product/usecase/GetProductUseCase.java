package com.vitrine.product.usecase;

import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.usecase.GetCategoryUseCase;
import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.product.domain.Product;
import com.vitrine.product.dto.ProductDetailResponse;
import com.vitrine.product.dto.ProductSummaryResponse;
import com.vitrine.product.port.ProductRepositoryPort;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetProductUseCase {

    private final ProductRepositoryPort productRepository;
    private final GetCategoryUseCase getCategoryUseCase;

    public ProductDetailResponse getById(UUID id) {
        UUID tenantId = TenantContext.requireTenantId();
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        return buildDetailResponse(product, tenantId);
    }

    public ProductDetailResponse getBySlug(String slug) {
        UUID tenantId = TenantContext.requireTenantId();
        Product product = productRepository.findBySlugAndTenantId(slug, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o slug: " + slug));

        return buildDetailResponse(product, tenantId);
    }

    private ProductDetailResponse buildDetailResponse(Product product, UUID tenantId) {
        List<CategoryResponse> categories = product.getCategoryIds() != null
                ? product.getCategoryIds().stream().map(getCategoryUseCase::getById).toList()
                : List.of();

        List<ProductSummaryResponse> relatedProducts = productRepository
                .findRelatedProducts(tenantId, product.getId(), product.getCategoryIds(), 4)
                .stream()
                .map(ProductSummaryResponse::fromDomain)
                .toList();

        return ProductDetailResponse.fromDomain(product, categories, relatedProducts);
    }
}

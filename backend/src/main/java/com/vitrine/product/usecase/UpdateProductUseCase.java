package com.vitrine.product.usecase;

import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.usecase.GetCategoryUseCase;
import com.vitrine.common.exception.BusinessException;
import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.product.domain.Product;
import com.vitrine.product.domain.ProductImage;
import com.vitrine.product.dto.ProductDetailResponse;
import com.vitrine.product.dto.ProductInput;
import com.vitrine.product.port.ProductRepositoryPort;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateProductUseCase {

    private final ProductRepositoryPort productRepository;
    private final GetCategoryUseCase getCategoryUseCase;

    @Transactional
    public ProductDetailResponse execute(UUID id, ProductInput input) {
        UUID tenantId = TenantContext.requireTenantId();

        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        Optional<Product> existingWithSlug = productRepository.findBySlugAndTenantId(input.getSlug(), tenantId);
        if (existingWithSlug.isPresent() && !existingWithSlug.get().getId().equals(id)) {
            throw new BusinessException("Já existe outro produto com este slug.");
        }

        product.update(
                input.getName(),
                input.getSlug(),
                input.getShortDescription(),
                input.getDescription(),
                input.isFeatured(),
                input.getDisplayOrder(),
                input.isActive(),
                input.getCategoryIds()
        );

        if (input.getImageUrls() != null) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < input.getImageUrls().size(); i++) {
                images.add(ProductImage.create(UUID.randomUUID(), product.getId(), tenantId, input.getImageUrls().get(i), i));
            }
            product.setImages(images);
        }

        Product updated = productRepository.save(product);

        List<CategoryResponse> categories = updated.getCategoryIds() != null
                ? updated.getCategoryIds().stream().map(getCategoryUseCase::getById).toList()
                : List.of();

        return ProductDetailResponse.fromDomain(updated, categories, List.of());
    }
}

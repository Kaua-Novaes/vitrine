package com.vitrine.product.usecase;

import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.usecase.GetCategoryUseCase;
import com.vitrine.common.exception.BusinessException;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateProductUseCase {

    private final ProductRepositoryPort productRepository;
    private final GetCategoryUseCase getCategoryUseCase;

    @Transactional
    public ProductDetailResponse execute(ProductInput input) {
        UUID tenantId = TenantContext.requireTenantId();

        if (productRepository.existsBySlugAndTenantId(input.getSlug(), tenantId)) {
            throw new BusinessException("Já existe um produto com o slug informado.");
        }

        UUID productId = UUID.randomUUID();

        List<ProductImage> images = new ArrayList<>();
        if (input.getImageUrls() != null) {
            for (int i = 0; i < input.getImageUrls().size(); i++) {
                images.add(ProductImage.create(UUID.randomUUID(), productId, tenantId, input.getImageUrls().get(i), i));
            }
        }

        Product product = Product.create(
                productId,
                tenantId,
                input.getName(),
                input.getSlug(),
                input.getShortDescription(),
                input.getDescription(),
                input.isFeatured(),
                input.getDisplayOrder(),
                input.isActive(),
                input.getCategoryIds()
        );
        product.setImages(images);

        Product saved = productRepository.save(product);

        List<CategoryResponse> categories = saved.getCategoryIds() != null
                ? saved.getCategoryIds().stream().map(getCategoryUseCase::getById).toList()
                : List.of();

        return ProductDetailResponse.fromDomain(saved, categories, List.of());
    }
}

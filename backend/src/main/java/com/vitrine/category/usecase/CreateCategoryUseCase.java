package com.vitrine.category.usecase;

import com.vitrine.category.domain.Category;
import com.vitrine.category.dto.CategoryInput;
import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.port.CategoryRepositoryPort;
import com.vitrine.common.exception.BusinessException;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreateCategoryUseCase {

    private final CategoryRepositoryPort categoryRepository;

    @Transactional
    public CategoryResponse execute(CategoryInput input) {
        UUID tenantId = TenantContext.requireTenantId();

        if (categoryRepository.existsBySlugAndTenantId(input.getSlug(), tenantId)) {
            throw new BusinessException("Já existe uma categoria cadastrada com o slug informado.");
        }

        Category category = Category.create(
                UUID.randomUUID(),
                tenantId,
                input.getName(),
                input.getSlug(),
                input.getDescription(),
                input.getImageUrl(),
                input.getDisplayOrder(),
                input.isActive()
        );

        Category saved = categoryRepository.save(category);
        return CategoryResponse.fromDomain(saved);
    }
}

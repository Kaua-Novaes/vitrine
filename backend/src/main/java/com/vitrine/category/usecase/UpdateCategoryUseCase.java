package com.vitrine.category.usecase;

import com.vitrine.category.domain.Category;
import com.vitrine.category.dto.CategoryInput;
import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.port.CategoryRepositoryPort;
import com.vitrine.common.exception.BusinessException;
import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateCategoryUseCase {

    private final CategoryRepositoryPort categoryRepository;

    @Transactional
    public CategoryResponse execute(UUID id, CategoryInput input) {
        UUID tenantId = TenantContext.requireTenantId();

        Category category = categoryRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        Optional<Category> existingWithSlug = categoryRepository.findBySlugAndTenantId(input.getSlug(), tenantId);
        if (existingWithSlug.isPresent() && !existingWithSlug.get().getId().equals(id)) {
            throw new BusinessException("Já existe outra categoria com este slug.");
        }

        category.update(
                input.getName(),
                input.getSlug(),
                input.getDescription(),
                input.getImageUrl(),
                input.getDisplayOrder(),
                input.isActive()
        );

        Category updated = categoryRepository.save(category);
        return CategoryResponse.fromDomain(updated);
    }
}

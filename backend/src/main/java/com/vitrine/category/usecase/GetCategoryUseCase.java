package com.vitrine.category.usecase;

import com.vitrine.category.domain.Category;
import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.port.CategoryRepositoryPort;
import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GetCategoryUseCase {

    private final CategoryRepositoryPort categoryRepository;

    public CategoryResponse getById(UUID id) {
        UUID tenantId = TenantContext.requireTenantId();
        return categoryRepository.findByIdAndTenantId(id, tenantId)
                .map(CategoryResponse::fromDomain)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));
    }

    public CategoryResponse getBySlug(String slug) {
        UUID tenantId = TenantContext.requireTenantId();
        return categoryRepository.findBySlugAndTenantId(slug, tenantId)
                .map(CategoryResponse::fromDomain)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com o slug: " + slug));
    }
}

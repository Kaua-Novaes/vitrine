package com.vitrine.category.usecase;

import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.port.CategoryRepositoryPort;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ListCategoriesUseCase {

    private final CategoryRepositoryPort categoryRepository;

    public List<CategoryResponse> listAdminCategories() {
        UUID tenantId = TenantContext.requireTenantId();
        return categoryRepository.findAllByTenantId(tenantId).stream()
                .map(CategoryResponse::fromDomain)
                .toList();
    }

    public List<CategoryResponse> listPublicActiveCategories() {
        UUID tenantId = TenantContext.requireTenantId();
        return categoryRepository.findAllActiveByTenantId(tenantId).stream()
                .map(CategoryResponse::fromDomain)
                .toList();
    }
}

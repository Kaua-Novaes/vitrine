package com.vitrine.category.usecase;

import com.vitrine.category.domain.Category;
import com.vitrine.category.port.CategoryRepositoryPort;
import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteCategoryUseCase {

    private final CategoryRepositoryPort categoryRepository;

    @Transactional
    public void execute(UUID id) {
        UUID tenantId = TenantContext.requireTenantId();
        Category category = categoryRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        categoryRepository.deleteByIdAndTenantId(category.getId(), tenantId);
    }
}

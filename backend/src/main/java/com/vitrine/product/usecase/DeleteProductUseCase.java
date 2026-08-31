package com.vitrine.product.usecase;

import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.product.domain.Product;
import com.vitrine.product.port.ProductRepositoryPort;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteProductUseCase {

    private final ProductRepositoryPort productRepository;

    @Transactional
    public void execute(UUID id) {
        UUID tenantId = TenantContext.requireTenantId();
        Product product = productRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        productRepository.deleteByIdAndTenantId(product.getId(), tenantId);
    }
}

package com.vitrine.testimonial.usecase;

import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.tenant.context.TenantContext;
import com.vitrine.testimonial.domain.Testimonial;
import com.vitrine.testimonial.port.TestimonialRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteTestimonialUseCase {

    private final TestimonialRepositoryPort testimonialRepository;

    @Transactional
    public void execute(UUID id) {
        UUID tenantId = TenantContext.requireTenantId();
        Testimonial testimonial = testimonialRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Depoimento não encontrado."));

        testimonialRepository.deleteByIdAndTenantId(testimonial.getId(), tenantId);
    }
}

package com.vitrine.testimonial.usecase;

import com.vitrine.common.exception.ResourceNotFoundException;
import com.vitrine.tenant.context.TenantContext;
import com.vitrine.testimonial.domain.Testimonial;
import com.vitrine.testimonial.dto.TestimonialInput;
import com.vitrine.testimonial.dto.TestimonialResponse;
import com.vitrine.testimonial.port.TestimonialRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateTestimonialUseCase {

    private final TestimonialRepositoryPort testimonialRepository;

    @Transactional
    public TestimonialResponse execute(UUID id, TestimonialInput input) {
        UUID tenantId = TenantContext.requireTenantId();

        Testimonial testimonial = testimonialRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Depoimento não encontrado."));

        testimonial.update(
                input.getName(),
                input.getText(),
                input.getDisplayOrder(),
                input.isActive()
        );

        Testimonial updated = testimonialRepository.save(testimonial);
        return TestimonialResponse.fromDomain(updated);
    }
}

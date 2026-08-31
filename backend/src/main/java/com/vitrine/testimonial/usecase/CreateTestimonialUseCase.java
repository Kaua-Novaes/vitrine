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
public class CreateTestimonialUseCase {

    private final TestimonialRepositoryPort testimonialRepository;

    @Transactional
    public TestimonialResponse execute(TestimonialInput input) {
        UUID tenantId = TenantContext.requireTenantId();

        Testimonial testimonial = Testimonial.create(
                UUID.randomUUID(),
                tenantId,
                input.getName(),
                input.getText(),
                input.getDisplayOrder(),
                input.isActive()
        );

        Testimonial saved = testimonialRepository.save(testimonial);
        return TestimonialResponse.fromDomain(saved);
    }
}

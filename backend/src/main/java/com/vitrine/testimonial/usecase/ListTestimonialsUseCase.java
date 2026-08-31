package com.vitrine.testimonial.usecase;

import com.vitrine.tenant.context.TenantContext;
import com.vitrine.testimonial.dto.TestimonialResponse;
import com.vitrine.testimonial.port.TestimonialRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ListTestimonialsUseCase {

    private final TestimonialRepositoryPort testimonialRepository;

    public List<TestimonialResponse> listAdminTestimonials() {
        UUID tenantId = TenantContext.requireTenantId();
        return testimonialRepository.findAllByTenantId(tenantId).stream()
                .map(TestimonialResponse::fromDomain)
                .toList();
    }

    public List<TestimonialResponse> listPublicActiveTestimonials() {
        UUID tenantId = TenantContext.requireTenantId();
        return testimonialRepository.findAllActiveByTenantId(tenantId).stream()
                .map(TestimonialResponse::fromDomain)
                .toList();
    }
}

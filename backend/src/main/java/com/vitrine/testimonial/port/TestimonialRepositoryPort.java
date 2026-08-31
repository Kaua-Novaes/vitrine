package com.vitrine.testimonial.port;

import com.vitrine.testimonial.domain.Testimonial;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TestimonialRepositoryPort {
    Testimonial save(Testimonial testimonial);
    Optional<Testimonial> findByIdAndTenantId(UUID id, UUID tenantId);
    List<Testimonial> findAllByTenantId(UUID tenantId);
    List<Testimonial> findAllActiveByTenantId(UUID tenantId);
    void deleteByIdAndTenantId(UUID id, UUID tenantId);
}

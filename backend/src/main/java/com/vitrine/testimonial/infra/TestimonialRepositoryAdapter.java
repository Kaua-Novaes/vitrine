package com.vitrine.testimonial.infra;

import com.vitrine.testimonial.domain.Testimonial;
import com.vitrine.testimonial.port.TestimonialRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class TestimonialRepositoryAdapter implements TestimonialRepositoryPort {

    private final TestimonialJpaRepository jpaRepository;

    @Override
    public Testimonial save(Testimonial testimonial) {
        TestimonialJpaEntity entity = TestimonialJpaEntity.fromDomain(testimonial);
        return jpaRepository.save(entity).toDomain();
    }

    @Override
    public Optional<Testimonial> findByIdAndTenantId(UUID id, UUID tenantId) {
        return jpaRepository.findByIdAndTenantId(id, tenantId).map(TestimonialJpaEntity::toDomain);
    }

    @Override
    public List<Testimonial> findAllByTenantId(UUID tenantId) {
        return jpaRepository.findAllByTenantIdOrderByDisplayOrderAsc(tenantId).stream()
                .map(TestimonialJpaEntity::toDomain)
                .toList();
    }

    @Override
    public List<Testimonial> findAllActiveByTenantId(UUID tenantId) {
        return jpaRepository.findAllByTenantIdAndActiveTrueOrderByDisplayOrderAsc(tenantId).stream()
                .map(TestimonialJpaEntity::toDomain)
                .toList();
    }

    @Override
    public void deleteByIdAndTenantId(UUID id, UUID tenantId) {
        jpaRepository.deleteByIdAndTenantId(id, tenantId);
    }
}

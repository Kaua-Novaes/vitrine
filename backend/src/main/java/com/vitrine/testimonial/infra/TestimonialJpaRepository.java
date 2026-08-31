package com.vitrine.testimonial.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TestimonialJpaRepository extends JpaRepository<TestimonialJpaEntity, UUID> {
    Optional<TestimonialJpaEntity> findByIdAndTenantId(UUID id, UUID tenantId);
    List<TestimonialJpaEntity> findAllByTenantIdOrderByDisplayOrderAsc(UUID tenantId);
    List<TestimonialJpaEntity> findAllByTenantIdAndActiveTrueOrderByDisplayOrderAsc(UUID tenantId);
    void deleteByIdAndTenantId(UUID id, UUID tenantId);
}

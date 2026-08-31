package com.vitrine.testimonial.infra;

import com.vitrine.testimonial.domain.Testimonial;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "testimonials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialJpaEntity {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public static TestimonialJpaEntity fromDomain(Testimonial testimonial) {
        return new TestimonialJpaEntity(
                testimonial.getId(),
                testimonial.getTenantId(),
                testimonial.getName(),
                testimonial.getText(),
                testimonial.getDisplayOrder(),
                testimonial.isActive(),
                testimonial.getCreatedAt(),
                testimonial.getUpdatedAt()
        );
    }

    public Testimonial toDomain() {
        return new Testimonial(id, tenantId, name, text, displayOrder, active, createdAt, updatedAt);
    }
}

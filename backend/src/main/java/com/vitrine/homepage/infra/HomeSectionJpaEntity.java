package com.vitrine.homepage.infra;

import com.vitrine.homepage.domain.HomeSection;
import com.vitrine.homepage.domain.HomeSectionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "home_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HomeSectionJpaEntity {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HomeSectionType type;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean active;

    @Column(columnDefinition = "TEXT")
    private String configuration;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public static HomeSectionJpaEntity fromDomain(HomeSection section) {
        return new HomeSectionJpaEntity(
                section.getId(),
                section.getTenantId(),
                section.getType(),
                section.getDisplayOrder(),
                section.isActive(),
                section.getConfiguration(),
                section.getCreatedAt(),
                section.getUpdatedAt()
        );
    }

    public HomeSection toDomain() {
        return new HomeSection(id, tenantId, type, displayOrder, active, configuration, createdAt, updatedAt);
    }
}

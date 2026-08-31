package com.vitrine.tenant.infra;

import com.vitrine.tenant.domain.Tenant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TenantJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public static TenantJpaEntity fromDomain(Tenant tenant) {
        return new TenantJpaEntity(
                tenant.getId(),
                tenant.getName(),
                tenant.getSlug(),
                tenant.isActive(),
                tenant.getCreatedAt(),
                tenant.getUpdatedAt()
        );
    }

    public Tenant toDomain() {
        return new Tenant(id, name, slug, active, createdAt, updatedAt);
    }
}

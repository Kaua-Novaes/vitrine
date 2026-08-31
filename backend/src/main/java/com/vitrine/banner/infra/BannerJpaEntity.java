package com.vitrine.banner.infra;

import com.vitrine.banner.domain.Banner;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BannerJpaEntity {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(nullable = false)
    private String title;

    @Column(name = "desktop_image_url", nullable = false, length = 1000)
    private String desktopImageUrl;

    @Column(name = "mobile_image_url", nullable = false, length = 1000)
    private String mobileImageUrl;

    @Column(name = "link_url", length = 1000)
    private String linkUrl;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public static BannerJpaEntity fromDomain(Banner banner) {
        return new BannerJpaEntity(
                banner.getId(),
                banner.getTenantId(),
                banner.getTitle(),
                banner.getDesktopImageUrl(),
                banner.getMobileImageUrl(),
                banner.getLinkUrl(),
                banner.getDisplayOrder(),
                banner.isActive(),
                banner.getCreatedAt(),
                banner.getUpdatedAt()
        );
    }

    public Banner toDomain() {
        return new Banner(id, tenantId, title, desktopImageUrl, mobileImageUrl, linkUrl, displayOrder, active, createdAt, updatedAt);
    }
}

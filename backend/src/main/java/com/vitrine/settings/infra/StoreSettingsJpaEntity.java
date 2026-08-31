package com.vitrine.settings.infra;

import com.vitrine.settings.domain.StoreSettings;
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
@Table(name = "store_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StoreSettingsJpaEntity {

    @Id
    private UUID id;

    @Column(name = "tenant_id", nullable = false, unique = true)
    private UUID tenantId;

    @Column(name = "logo_url", length = 1000)
    private String logoUrl;

    @Column(name = "primary_color", length = 50)
    private String primaryColor;

    @Column(name = "secondary_color", length = 50)
    private String secondaryColor;

    @Column(name = "background_color", length = 50)
    private String backgroundColor;

    @Column(name = "text_color", length = 50)
    private String textColor;

    @Column(name = "whatsapp_number", length = 50)
    private String whatsappNumber;

    @Column(name = "whatsapp_message_template", columnDefinition = "TEXT")
    private String whatsappMessageTemplate;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public static StoreSettingsJpaEntity fromDomain(StoreSettings settings) {
        return new StoreSettingsJpaEntity(
                settings.getId(),
                settings.getTenantId(),
                settings.getLogoUrl(),
                settings.getPrimaryColor(),
                settings.getSecondaryColor(),
                settings.getBackgroundColor(),
                settings.getTextColor(),
                settings.getWhatsappNumber(),
                settings.getWhatsappMessageTemplate(),
                settings.getCreatedAt(),
                settings.getUpdatedAt()
        );
    }

    public StoreSettings toDomain() {
        return new StoreSettings(
                id,
                tenantId,
                logoUrl,
                primaryColor,
                secondaryColor,
                backgroundColor,
                textColor,
                whatsappNumber,
                whatsappMessageTemplate,
                createdAt,
                updatedAt
        );
    }
}

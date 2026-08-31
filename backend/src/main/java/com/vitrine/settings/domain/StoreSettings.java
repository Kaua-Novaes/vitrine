package com.vitrine.settings.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class StoreSettings {
    private final UUID id;
    private final UUID tenantId;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String backgroundColor;
    private String textColor;
    private String whatsappNumber;
    private String whatsappMessageTemplate;
    private final Instant createdAt;
    private Instant updatedAt;

    public StoreSettings(UUID id, UUID tenantId, String logoUrl, String primaryColor, String secondaryColor,
                         String backgroundColor, String textColor, String whatsappNumber, String whatsappMessageTemplate,
                         Instant createdAt, Instant updatedAt) {
        if (id == null) throw new IllegalArgumentException("StoreSettings ID é obrigatório");
        if (tenantId == null) throw new IllegalArgumentException("Tenant ID é obrigatório");

        this.id = id;
        this.tenantId = tenantId;
        this.logoUrl = logoUrl;
        this.primaryColor = primaryColor != null ? primaryColor : "#2563EB";
        this.secondaryColor = secondaryColor != null ? secondaryColor : "#1E40AF";
        this.backgroundColor = backgroundColor != null ? backgroundColor : "#FFFFFF";
        this.textColor = textColor != null ? textColor : "#1F2937";
        this.whatsappNumber = whatsappNumber;
        this.whatsappMessageTemplate = whatsappMessageTemplate;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static StoreSettings createDefault(UUID tenantId) {
        return new StoreSettings(
                UUID.randomUUID(),
                tenantId,
                null,
                "#2563EB",
                "#1E40AF",
                "#FFFFFF",
                "#1F2937",
                null,
                "Olá! Gostaria de mais informações sobre os produtos da vitrine.",
                Instant.now(),
                Instant.now()
        );
    }

    public void update(String logoUrl, String primaryColor, String secondaryColor, String backgroundColor,
                       String textColor, String whatsappNumber, String whatsappMessageTemplate) {
        this.logoUrl = logoUrl;
        if (primaryColor != null && !primaryColor.isBlank()) this.primaryColor = primaryColor;
        if (secondaryColor != null && !secondaryColor.isBlank()) this.secondaryColor = secondaryColor;
        if (backgroundColor != null && !backgroundColor.isBlank()) this.backgroundColor = backgroundColor;
        if (textColor != null && !textColor.isBlank()) this.textColor = textColor;
        this.whatsappNumber = whatsappNumber;
        this.whatsappMessageTemplate = whatsappMessageTemplate;
        this.updatedAt = Instant.now();
    }
}

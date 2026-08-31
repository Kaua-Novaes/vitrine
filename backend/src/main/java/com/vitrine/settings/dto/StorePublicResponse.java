package com.vitrine.settings.dto;

import com.vitrine.settings.domain.StoreSettings;
import com.vitrine.tenant.domain.Tenant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StorePublicResponse {
    private UUID id;
    private String name;
    private String slug;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String backgroundColor;
    private String textColor;
    private String whatsappNumber;
    private String whatsappMessageTemplate;

    public static StorePublicResponse from(Tenant tenant, StoreSettings settings) {
        return StorePublicResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .slug(tenant.getSlug())
                .logoUrl(settings != null ? settings.getLogoUrl() : null)
                .primaryColor(settings != null ? settings.getPrimaryColor() : "#2563EB")
                .secondaryColor(settings != null ? settings.getSecondaryColor() : "#1E40AF")
                .backgroundColor(settings != null ? settings.getBackgroundColor() : "#FFFFFF")
                .textColor(settings != null ? settings.getTextColor() : "#1F2937")
                .whatsappNumber(settings != null ? settings.getWhatsappNumber() : null)
                .whatsappMessageTemplate(settings != null ? settings.getWhatsappMessageTemplate() : null)
                .build();
    }
}

package com.vitrine.settings.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStoreSettingsRequest {
    private String storeName;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String backgroundColor;
    private String textColor;
    private String whatsappNumber;
    private String whatsappMessageTemplate;
}

package com.vitrine.banner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerInput {
    @NotBlank(message = "O título é obrigatório")
    private String title;

    @NotBlank(message = "A imagem desktop é obrigatória")
    private String desktopImageUrl;

    @NotBlank(message = "A imagem mobile é obrigatória")
    private String mobileImageUrl;

    private String linkUrl;
    @Builder.Default
    private Integer displayOrder = 0;
    @Builder.Default
    private Boolean active = true;

    public int getDisplayOrder() {
        return displayOrder != null ? displayOrder : 0;
    }

    public boolean isActive() {
        return active == null || active;
    }
}

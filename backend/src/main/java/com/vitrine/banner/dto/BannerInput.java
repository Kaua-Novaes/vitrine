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
    private int displayOrder;
    @Builder.Default
    private boolean active = true;
}

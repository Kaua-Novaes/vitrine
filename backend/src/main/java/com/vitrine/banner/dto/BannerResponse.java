package com.vitrine.banner.dto;

import com.vitrine.banner.domain.Banner;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {
    private UUID id;
    private String title;
    private String desktopImageUrl;
    private String mobileImageUrl;
    private String linkUrl;
    private int displayOrder;
    private boolean active;

    public static BannerResponse fromDomain(Banner banner) {
        return BannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .desktopImageUrl(banner.getDesktopImageUrl())
                .mobileImageUrl(banner.getMobileImageUrl())
                .linkUrl(banner.getLinkUrl())
                .displayOrder(banner.getDisplayOrder())
                .active(banner.isActive())
                .build();
    }
}

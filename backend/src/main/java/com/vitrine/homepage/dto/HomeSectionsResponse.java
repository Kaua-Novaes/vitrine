package com.vitrine.homepage.dto;

import com.vitrine.banner.dto.BannerResponse;
import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.homepage.domain.HomeSectionType;
import com.vitrine.product.dto.ProductSummaryResponse;
import com.vitrine.testimonial.dto.TestimonialResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeSectionsResponse {
    private List<BannerResponse> banners;
    private List<CategoryResponse> featuredCategories;
    private List<ProductSummaryResponse> featuredProducts;
    private List<TestimonialResponse> testimonials;
    private List<SectionOrderItem> sectionsOrder;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SectionOrderItem {
        private HomeSectionType type;
        private int displayOrder;
        private boolean active;
    }
}

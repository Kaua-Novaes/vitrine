package com.vitrine.homepage.usecase;

import com.vitrine.banner.dto.BannerResponse;
import com.vitrine.banner.usecase.ListBannersUseCase;
import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.usecase.ListCategoriesUseCase;
import com.vitrine.homepage.domain.HomeSection;
import com.vitrine.homepage.domain.HomeSectionType;
import com.vitrine.homepage.dto.HomeSectionsResponse;
import com.vitrine.homepage.port.HomeSectionRepositoryPort;
import com.vitrine.product.dto.ProductSummaryResponse;
import com.vitrine.product.usecase.ListProductsUseCase;
import com.vitrine.tenant.context.TenantContext;
import com.vitrine.testimonial.dto.TestimonialResponse;
import com.vitrine.testimonial.usecase.ListTestimonialsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetPublicHomeCompositionUseCase {

    private final ListBannersUseCase listBannersUseCase;
    private final ListCategoriesUseCase listCategoriesUseCase;
    private final ListProductsUseCase listProductsUseCase;
    private final ListTestimonialsUseCase listTestimonialsUseCase;
    private final HomeSectionRepositoryPort homeSectionRepository;

    public HomeSectionsResponse execute() {
        UUID tenantId = TenantContext.requireTenantId();

        List<BannerResponse> banners = listBannersUseCase.listPublicActiveBanners();
        List<CategoryResponse> categories = listCategoriesUseCase.listPublicActiveCategories();
        List<ProductSummaryResponse> featuredProducts = listProductsUseCase.listFeaturedProducts();
        List<TestimonialResponse> testimonials = listTestimonialsUseCase.listPublicActiveTestimonials();

        List<HomeSection> sections = homeSectionRepository.findAllActiveByTenantId(tenantId);

        List<HomeSectionsResponse.SectionOrderItem> sectionsOrder;
        if (sections.isEmpty()) {
            sectionsOrder = List.of(
                    new HomeSectionsResponse.SectionOrderItem(HomeSectionType.BANNER, 1, true),
                    new HomeSectionsResponse.SectionOrderItem(HomeSectionType.CATEGORY_SHOWCASE, 2, true),
                    new HomeSectionsResponse.SectionOrderItem(HomeSectionType.PRODUCT_SHOWCASE, 3, true),
                    new HomeSectionsResponse.SectionOrderItem(HomeSectionType.TESTIMONIAL, 4, true),
                    new HomeSectionsResponse.SectionOrderItem(HomeSectionType.CTA, 5, true)
            );
        } else {
            sectionsOrder = sections.stream()
                    .map(s -> new HomeSectionsResponse.SectionOrderItem(s.getType(), s.getDisplayOrder(), s.isActive()))
                    .toList();
        }

        return HomeSectionsResponse.builder()
                .banners(banners)
                .featuredCategories(categories)
                .featuredProducts(featuredProducts)
                .testimonials(testimonials)
                .sectionsOrder(sectionsOrder)
                .build();
    }
}

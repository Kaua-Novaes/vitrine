package com.vitrine.homepage;

import com.vitrine.banner.dto.BannerResponse;
import com.vitrine.banner.usecase.ListBannersUseCase;
import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.usecase.ListCategoriesUseCase;
import com.vitrine.homepage.dto.HomeSectionsResponse;
import com.vitrine.homepage.port.HomeSectionRepositoryPort;
import com.vitrine.homepage.usecase.GetPublicHomeCompositionUseCase;
import com.vitrine.product.dto.ProductSummaryResponse;
import com.vitrine.product.usecase.ListProductsUseCase;
import com.vitrine.tenant.context.TenantContext;
import com.vitrine.testimonial.dto.TestimonialResponse;
import com.vitrine.testimonial.usecase.ListTestimonialsUseCase;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HomeCompositionUseCaseTest {

    @Mock
    private ListBannersUseCase listBannersUseCase;

    @Mock
    private ListCategoriesUseCase listCategoriesUseCase;

    @Mock
    private ListProductsUseCase listProductsUseCase;

    @Mock
    private ListTestimonialsUseCase listTestimonialsUseCase;

    @Mock
    private HomeSectionRepositoryPort homeSectionRepository;

    private GetPublicHomeCompositionUseCase getPublicHomeCompositionUseCase;

    private final UUID tenantId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId(tenantId);
        getPublicHomeCompositionUseCase = new GetPublicHomeCompositionUseCase(
                listBannersUseCase,
                listCategoriesUseCase,
                listProductsUseCase,
                listTestimonialsUseCase,
                homeSectionRepository
        );
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void shouldReturnDefaultHomeSectionsComposition() {
        BannerResponse banner = BannerResponse.builder().title("Banner 1").build();
        CategoryResponse category = CategoryResponse.builder().name("Cat 1").build();
        ProductSummaryResponse product = ProductSummaryResponse.builder().name("Prod 1").build();
        TestimonialResponse testimonial = TestimonialResponse.builder().name("User 1").build();

        when(listBannersUseCase.listPublicActiveBanners()).thenReturn(List.of(banner));
        when(listCategoriesUseCase.listPublicActiveCategories()).thenReturn(List.of(category));
        when(listProductsUseCase.listFeaturedProducts()).thenReturn(List.of(product));
        when(listTestimonialsUseCase.listPublicActiveTestimonials()).thenReturn(List.of(testimonial));
        when(homeSectionRepository.findAllActiveByTenantId(tenantId)).thenReturn(List.of());

        HomeSectionsResponse response = getPublicHomeCompositionUseCase.execute();

        assertNotNull(response);
        assertEquals(1, response.getBanners().size());
        assertEquals(1, response.getFeaturedCategories().size());
        assertEquals(1, response.getFeaturedProducts().size());
        assertEquals(1, response.getTestimonials().size());
        assertEquals(5, response.getSectionsOrder().size());
    }
}

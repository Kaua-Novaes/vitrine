package com.vitrine.product;

import com.vitrine.category.usecase.GetCategoryUseCase;
import com.vitrine.common.exception.BusinessException;
import com.vitrine.product.domain.Product;
import com.vitrine.product.dto.ProductDetailResponse;
import com.vitrine.product.dto.ProductInput;
import com.vitrine.product.port.ProductRepositoryPort;
import com.vitrine.product.usecase.CreateProductUseCase;
import com.vitrine.product.usecase.GetProductUseCase;
import com.vitrine.tenant.context.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductUseCaseTest {

    @Mock
    private ProductRepositoryPort productRepository;

    @Mock
    private GetCategoryUseCase getCategoryUseCase;

    private CreateProductUseCase createProductUseCase;
    private GetProductUseCase getProductUseCase;

    private final UUID tenantId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId(tenantId);
        createProductUseCase = new CreateProductUseCase(productRepository, getCategoryUseCase);
        getProductUseCase = new GetProductUseCase(productRepository, getCategoryUseCase);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void shouldCreateProductSuccessfully() {
        ProductInput input = ProductInput.builder()
                .name("Cartão Couchê 300g")
                .slug("cartao-couche-300g")
                .shortDescription("Cartão de visita com verniz localizado")
                .description("Descrição completa do produto")
                .featured(true)
                .displayOrder(1)
                .active(true)
                .imageUrls(List.of("https://example.com/p1.jpg"))
                .build();

        when(productRepository.existsBySlugAndTenantId("cartao-couche-300g", tenantId)).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductDetailResponse response = createProductUseCase.execute(input);

        assertNotNull(response);
        assertEquals("Cartão Couchê 300g", response.getName());
        assertEquals("cartao-couche-300g", response.getSlug());
        assertTrue(response.isFeatured());
        assertEquals(1, response.getImages().size());
    }

    @Test
    void shouldRejectDuplicateSlug() {
        ProductInput input = ProductInput.builder()
                .name("Cartão")
                .slug("cartao")
                .build();

        when(productRepository.existsBySlugAndTenantId("cartao", tenantId)).thenReturn(true);

        assertThrows(BusinessException.class, () -> createProductUseCase.execute(input));
    }

    @Test
    void shouldGetProductBySlug() {
        Product product = Product.create(
                UUID.randomUUID(),
                tenantId,
                "Adesivo Vinil",
                "adesivo-vinil",
                "Adesivo à prova d'água",
                "Detalhes do adesivo",
                false,
                1,
                true,
                List.of()
        );

        when(productRepository.findBySlugAndTenantId("adesivo-vinil", tenantId)).thenReturn(Optional.of(product));
        when(productRepository.findRelatedProducts(tenantId, product.getId(), List.of(), 4)).thenReturn(List.of());

        ProductDetailResponse response = getProductUseCase.getBySlug("adesivo-vinil");

        assertNotNull(response);
        assertEquals("Adesivo Vinil", response.getName());
    }
}

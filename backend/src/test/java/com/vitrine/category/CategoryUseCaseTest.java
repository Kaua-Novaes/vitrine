package com.vitrine.category;

import com.vitrine.category.domain.Category;
import com.vitrine.category.dto.CategoryInput;
import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.port.CategoryRepositoryPort;
import com.vitrine.category.usecase.CreateCategoryUseCase;
import com.vitrine.category.usecase.GetCategoryUseCase;
import com.vitrine.category.usecase.UpdateCategoryUseCase;
import com.vitrine.common.exception.BusinessException;
import com.vitrine.tenant.context.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryUseCaseTest {

    @Mock
    private CategoryRepositoryPort categoryRepository;

    private CreateCategoryUseCase createCategoryUseCase;
    private UpdateCategoryUseCase updateCategoryUseCase;
    private GetCategoryUseCase getCategoryUseCase;

    private final UUID tenantId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId(tenantId);
        createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
        updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
        getCategoryUseCase = new GetCategoryUseCase(categoryRepository);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void shouldCreateCategorySuccessfully() {
        CategoryInput input = CategoryInput.builder()
                .name("Cartões de Visita")
                .slug("cartoes-de-visita")
                .description("Cartões personalizados")
                .imageUrl("https://example.com/cartao.jpg")
                .displayOrder(1)
                .active(true)
                .build();

        when(categoryRepository.existsBySlugAndTenantId("cartoes-de-visita", tenantId)).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CategoryResponse response = createCategoryUseCase.execute(input);

        assertNotNull(response);
        assertEquals("Cartões de Visita", response.getName());
        assertEquals("cartoes-de-visita", response.getSlug());
        assertTrue(response.isActive());
    }

    @Test
    void shouldRejectCategoryWithDuplicateSlug() {
        CategoryInput input = CategoryInput.builder()
                .name("Cartões")
                .slug("cartoes")
                .build();

        when(categoryRepository.existsBySlugAndTenantId("cartoes", tenantId)).thenReturn(true);

        assertThrows(BusinessException.class, () -> createCategoryUseCase.execute(input));
    }

    @Test
    void shouldGetCategoryBySlug() {
        Category category = Category.create(UUID.randomUUID(), tenantId, "Panfletos", "panfletos", "desc", null, 2, true);
        when(categoryRepository.findBySlugAndTenantId("panfletos", tenantId)).thenReturn(Optional.of(category));

        CategoryResponse response = getCategoryUseCase.getBySlug("panfletos");

        assertNotNull(response);
        assertEquals("Panfletos", response.getName());
    }
}

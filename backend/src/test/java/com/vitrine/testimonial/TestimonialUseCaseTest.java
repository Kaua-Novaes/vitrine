package com.vitrine.testimonial;

import com.vitrine.tenant.context.TenantContext;
import com.vitrine.testimonial.domain.Testimonial;
import com.vitrine.testimonial.dto.TestimonialInput;
import com.vitrine.testimonial.dto.TestimonialResponse;
import com.vitrine.testimonial.port.TestimonialRepositoryPort;
import com.vitrine.testimonial.usecase.CreateTestimonialUseCase;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TestimonialUseCaseTest {

    @Mock
    private TestimonialRepositoryPort testimonialRepository;

    private CreateTestimonialUseCase createTestimonialUseCase;
    private ListTestimonialsUseCase listTestimonialsUseCase;

    private final UUID tenantId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId(tenantId);
        createTestimonialUseCase = new CreateTestimonialUseCase(testimonialRepository);
        listTestimonialsUseCase = new ListTestimonialsUseCase(testimonialRepository);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void shouldCreateTestimonialSuccessfully() {
        TestimonialInput input = TestimonialInput.builder()
                .name("Maria Silva")
                .text("Excelente atendimento e qualidade de impressão.")
                .displayOrder(1)
                .active(true)
                .build();

        when(testimonialRepository.save(any(Testimonial.class))).thenAnswer(inv -> inv.getArgument(0));

        TestimonialResponse response = createTestimonialUseCase.execute(input);

        assertNotNull(response);
        assertEquals("Maria Silva", response.getName());
        assertEquals("Excelente atendimento e qualidade de impressão.", response.getText());
    }

    @Test
    void shouldListPublicActiveTestimonials() {
        Testimonial t = Testimonial.create(UUID.randomUUID(), tenantId, "João", "Muito bom", 1, true);
        when(testimonialRepository.findAllActiveByTenantId(tenantId)).thenReturn(List.of(t));

        List<TestimonialResponse> responses = listTestimonialsUseCase.listPublicActiveTestimonials();

        assertEquals(1, responses.size());
        assertEquals("João", responses.get(0).getName());
    }
}

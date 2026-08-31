package com.vitrine.testimonial.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialInput {
    @NotBlank(message = "O nome é obrigatório")
    private String name;

    @NotBlank(message = "O texto do depoimento é obrigatório")
    private String text;

    private int displayOrder;
    @Builder.Default
    private boolean active = true;
}

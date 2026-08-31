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

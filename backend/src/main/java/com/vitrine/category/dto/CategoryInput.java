package com.vitrine.category.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryInput {
    @NotBlank(message = "O nome da categoria é obrigatório")
    private String name;

    @NotBlank(message = "O slug da categoria é obrigatório")
    private String slug;

    private String description;
    private String imageUrl;
    private int displayOrder;
    @Builder.Default
    private boolean active = true;
}

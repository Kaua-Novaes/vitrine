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

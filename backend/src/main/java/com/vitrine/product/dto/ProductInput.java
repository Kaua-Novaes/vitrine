package com.vitrine.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductInput {
    @NotBlank(message = "O nome do produto é obrigatório")
    private String name;

    @NotBlank(message = "O slug do produto é obrigatório")
    private String slug;

    private String shortDescription;
    private String description;
    private boolean featured;
    private int displayOrder;
    @Builder.Default
    private boolean active = true;
    private List<UUID> categoryIds;
    private List<String> imageUrls;
}

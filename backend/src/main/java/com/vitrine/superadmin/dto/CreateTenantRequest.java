package com.vitrine.superadmin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTenantRequest {

    @NotBlank(message = "O nome da loja é obrigatório")
    private String name;

    private String slug;

    @NotBlank(message = "O nome do proprietário é obrigatório")
    private String ownerName;

    @NotBlank(message = "O e-mail do proprietário é obrigatório")
    @Email(message = "E-mail inválido")
    private String ownerEmail;

    private String ownerPassword;
}

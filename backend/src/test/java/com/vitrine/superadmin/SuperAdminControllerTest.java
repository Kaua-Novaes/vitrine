package com.vitrine.superadmin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vitrine.superadmin.controller.SuperAdminController;
import com.vitrine.superadmin.dto.CreateTenantRequest;
import com.vitrine.superadmin.dto.SuperAdminMetricsResponse;
import com.vitrine.superadmin.dto.TenantSummaryResponse;
import com.vitrine.superadmin.service.SuperAdminService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SuperAdminController.class)
@AutoConfigureMockMvc(addFilters = false)
class SuperAdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private SuperAdminService superAdminService;

    @MockitoBean
    private com.vitrine.auth.service.JwtService jwtService;

    @MockitoBean
    private com.vitrine.tenant.port.TenantRepositoryPort tenantRepository;

    @Test
    @DisplayName("Deve listar todos os tenants no Super Admin")
    void shouldListAllTenants() throws Exception {
        UUID tenantId = UUID.randomUUID();
        TenantSummaryResponse response = TenantSummaryResponse.builder()
                .id(tenantId)
                .name("Gráfica Teste")
                .slug("grafica-teste")
                .ownerName("João")
                .ownerEmail("joao@teste.com")
                .active(true)
                .productCount(5)
                .createdAt(Instant.now())
                .build();

        when(superAdminService.getAllTenants()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/super-admin/tenants")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Gráfica Teste"))
                .andExpect(jsonPath("$[0].slug").value("grafica-teste"));
    }

    @Test
    @DisplayName("Deve provisionar um novo tenant com sucesso")
    void shouldCreateTenant() throws Exception {
        CreateTenantRequest request = CreateTenantRequest.builder()
                .name("Nova Gráfica")
                .slug("nova-grafica")
                .ownerName("Maria")
                .ownerEmail("maria@grafica.com")
                .ownerPassword("secret123")
                .build();

        TenantSummaryResponse response = TenantSummaryResponse.builder()
                .id(UUID.randomUUID())
                .name("Nova Gráfica")
                .slug("nova-grafica")
                .ownerName("Maria")
                .ownerEmail("maria@grafica.com")
                .active(true)
                .productCount(0)
                .createdAt(Instant.now())
                .build();

        when(superAdminService.createTenant(any())).thenReturn(response);

        mockMvc.perform(post("/api/super-admin/tenants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Nova Gráfica"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    @DisplayName("Deve retornar métricas globais no Super Admin")
    void shouldReturnMetrics() throws Exception {
        SuperAdminMetricsResponse metrics = SuperAdminMetricsResponse.builder()
                .totalTenants(10)
                .activeTenants(8)
                .totalProducts(120)
                .monthlyGrowthRate("+25%")
                .build();

        when(superAdminService.getMetrics()).thenReturn(metrics);

        mockMvc.perform(get("/api/super-admin/metrics")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTenants").value(10))
                .andExpect(jsonPath("$.totalProducts").value(120));
    }
}

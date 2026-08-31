package com.vitrine.tenant;

import com.vitrine.tenant.domain.Tenant;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class TenantTest {

    @Test
    void shouldCreateValidTenant() {
        UUID id = UUID.randomUUID();
        Tenant tenant = Tenant.create(id, "Gráfica Modelo", "grafica-modelo");

        assertEquals(id, tenant.getId());
        assertEquals("Gráfica Modelo", tenant.getName());
        assertEquals("grafica-modelo", tenant.getSlug());
        assertTrue(tenant.isActive());
        assertNotNull(tenant.getCreatedAt());
        assertNotNull(tenant.getUpdatedAt());
    }

    @Test
    void shouldNormalizeSlug() {
        Tenant tenant = Tenant.create(UUID.randomUUID(), "Gráfica & Copiadora", "GRAFICA MODELO SP");
        assertEquals("grafica-modelo-sp", tenant.getSlug());
    }

    @Test
    void shouldRejectInvalidData() {
        assertThrows(IllegalArgumentException.class, () -> Tenant.create(null, "", "slug"));
        assertThrows(IllegalArgumentException.class, () -> Tenant.create(UUID.randomUUID(), "Nome", ""));
    }
}

package com.vitrine.tenant;

import com.vitrine.tenant.context.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class TenantContextTest {

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void shouldSetAndGetTenantId() {
        UUID tenantId = UUID.randomUUID();
        TenantContext.setTenantId(tenantId);

        assertEquals(tenantId, TenantContext.getTenantId());
        assertTrue(TenantContext.hasTenant());
    }

    @Test
    void shouldClearTenantContext() {
        UUID tenantId = UUID.randomUUID();
        TenantContext.setTenantId(tenantId);
        TenantContext.clear();

        assertNull(TenantContext.getTenantId());
        assertFalse(TenantContext.hasTenant());
    }

    @Test
    void shouldThrowWhenTenantIdRequiredButAbsent() {
        TenantContext.clear();
        assertThrows(IllegalStateException.class, TenantContext::requireTenantId);
    }
}

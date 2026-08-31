package com.vitrine.tenant;

import com.vitrine.common.exception.TenantAccessDeniedException;
import com.vitrine.tenant.context.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class TenantIsolationTest {

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void shouldAllowAccessWhenTenantMatches() {
        UUID tenantId = UUID.randomUUID();
        TenantContext.setTenantId(tenantId);

        assertDoesNotThrow(() -> TenantContext.validateAccess(tenantId));
    }

    @Test
    void shouldDenyAccessWhenTenantDoesNotMatch() {
        UUID tenantA = UUID.randomUUID();
        UUID tenantB = UUID.randomUUID();

        TenantContext.setTenantId(tenantA);

        assertThrows(TenantAccessDeniedException.class, () -> TenantContext.validateAccess(tenantB));
    }
}

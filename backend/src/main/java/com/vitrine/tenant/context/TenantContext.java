package com.vitrine.tenant.context;

import com.vitrine.common.exception.TenantAccessDeniedException;

import java.util.Objects;
import java.util.UUID;

public final class TenantContext {

    private static final ThreadLocal<UUID> CURRENT_TENANT = new ThreadLocal<>();

    private TenantContext() {
    }

    public static void setTenantId(UUID tenantId) {
        CURRENT_TENANT.set(tenantId);
    }

    public static UUID getTenantId() {
        return CURRENT_TENANT.get();
    }

    public static boolean hasTenant() {
        return CURRENT_TENANT.get() != null;
    }

    public static UUID requireTenantId() {
        UUID tenantId = CURRENT_TENANT.get();
        if (tenantId == null) {
            throw new IllegalStateException("TenantContext não possui nenhum tenant_id configurado para a requisição corrente.");
        }
        return tenantId;
    }

    public static void validateAccess(UUID resourceTenantId) {
        UUID currentTenant = requireTenantId();
        if (!Objects.equals(currentTenant, resourceTenantId)) {
            throw new TenantAccessDeniedException("Acesso negado ao recurso pertencente a outro tenant.");
        }
    }

    public static void clear() {
        CURRENT_TENANT.remove();
    }
}

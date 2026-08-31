package com.vitrine.tenant.infra;

import com.vitrine.tenant.context.TenantContext;
import com.vitrine.tenant.domain.Tenant;
import com.vitrine.tenant.port.TenantRepositoryPort;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class TenantResolverFilter extends OncePerRequestFilter {

    private final TenantRepositoryPort tenantRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String path = request.getRequestURI();

            // Para requisições públicas da API de vitrine (/api/public/**)
            if (path.startsWith("/api/public")) {
                String tenantSlug = extractTenantSlug(request);
                if (tenantSlug != null && !tenantSlug.isBlank()) {
                    Optional<Tenant> tenantOpt = tenantRepository.findBySlug(tenantSlug);
                    tenantOpt.ifPresent(tenant -> TenantContext.setTenantId(tenant.getId()));
                }
            }

            filterChain.doFilter(request, response);
        } finally {
            // Context cleanup acontece ao fim do ciclo de requisição se não estiver em admin auth
            if (request.getRequestURI().startsWith("/api/public")) {
                TenantContext.clear();
            }
        }
    }

    private String extractTenantSlug(HttpServletRequest request) {
        // 1. Header direto (útil para desenvolvimento, testes e preview do frontend)
        String headerSlug = request.getHeader("X-Tenant-Slug");
        if (headerSlug != null && !headerSlug.isBlank()) {
            return headerSlug.trim();
        }

        // 2. Subdomínio extraído do Host (ex: grafica-modelo.vitrine.codecision.com.br)
        String host = request.getServerName();
        if (host != null && host.contains(".")) {
            String[] parts = host.split("\\.");
            if (parts.length >= 4 && parts[1].equalsIgnoreCase("vitrine")) {
                return parts[0].toLowerCase();
            }
            if (parts.length >= 3 && !parts[0].equalsIgnoreCase("www") && !parts[0].equalsIgnoreCase("api")) {
                if (parts[0].equalsIgnoreCase("vitrine")) {
                    return "grafica-modelo";
                }
                return parts[0].toLowerCase();
            }
        }

        return "grafica-modelo";
    }
}

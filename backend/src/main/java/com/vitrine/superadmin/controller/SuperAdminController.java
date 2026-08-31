package com.vitrine.superadmin.controller;

import com.vitrine.superadmin.dto.CreateTenantRequest;
import com.vitrine.superadmin.dto.SuperAdminMetricsResponse;
import com.vitrine.superadmin.dto.TenantSummaryResponse;
import com.vitrine.superadmin.service.SuperAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    @GetMapping("/tenants")
    public ResponseEntity<List<TenantSummaryResponse>> getAllTenants() {
        return ResponseEntity.ok(superAdminService.getAllTenants());
    }

    @PostMapping("/tenants")
    public ResponseEntity<TenantSummaryResponse> createTenant(@Valid @RequestBody CreateTenantRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(superAdminService.createTenant(request));
    }

    @PatchMapping("/tenants/{id}/status")
    public ResponseEntity<TenantSummaryResponse> toggleTenantStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean active = body.getOrDefault("active", true);
        return ResponseEntity.ok(superAdminService.toggleTenantStatus(id, active));
    }

    @GetMapping("/metrics")
    public ResponseEntity<SuperAdminMetricsResponse> getMetrics() {
        return ResponseEntity.ok(superAdminService.getMetrics());
    }
}

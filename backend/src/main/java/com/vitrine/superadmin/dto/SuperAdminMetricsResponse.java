package com.vitrine.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdminMetricsResponse {
    private long totalTenants;
    private long activeTenants;
    private long totalProducts;
    private String monthlyGrowthRate;
}

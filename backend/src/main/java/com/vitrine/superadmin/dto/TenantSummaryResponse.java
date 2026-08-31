package com.vitrine.superadmin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantSummaryResponse {
    private UUID id;
    private String name;
    private String slug;
    private String ownerName;
    private String ownerEmail;
    private boolean active;
    private long productCount;
    private Instant createdAt;
}

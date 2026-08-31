package com.vitrine.user.domain;

import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
public class User {
    private final UUID id;
    private final UUID tenantId;
    private String name;
    private String email;
    private String passwordHash;
    private Role role;
    private boolean active;
    private final Instant createdAt;
    private Instant updatedAt;

    public User(UUID id, UUID tenantId, String name, String email, String passwordHash, Role role, boolean active, Instant createdAt, Instant updatedAt) {
        if (id == null) throw new IllegalArgumentException("User ID é obrigatório");
        if (tenantId == null) throw new IllegalArgumentException("Tenant ID é obrigatório");
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome é obrigatório");
        if (email == null || email.isBlank()) throw new IllegalArgumentException("E-mail é obrigatório");
        if (passwordHash == null || passwordHash.isBlank()) throw new IllegalArgumentException("Senha é obrigatória");

        this.id = id;
        this.tenantId = tenantId;
        this.name = name.trim();
        this.email = email.trim().toLowerCase();
        this.passwordHash = passwordHash;
        this.role = role != null ? role : Role.MASTER;
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static User create(UUID id, UUID tenantId, String name, String email, String passwordHash, Role role) {
        return new User(
                id != null ? id : UUID.randomUUID(),
                tenantId,
                name,
                email,
                passwordHash,
                role,
                true,
                Instant.now(),
                Instant.now()
        );
    }
}

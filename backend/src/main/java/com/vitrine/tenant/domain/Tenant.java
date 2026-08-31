package com.vitrine.tenant.domain;

import lombok.Getter;

import java.text.Normalizer;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Getter
public class Tenant {
    private final UUID id;
    private String name;
    private String slug;
    private boolean active;
    private final Instant createdAt;
    private Instant updatedAt;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public Tenant(UUID id, String name, String slug, boolean active, Instant createdAt, Instant updatedAt) {
        if (id == null) throw new IllegalArgumentException("Tenant ID não pode ser nulo");
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome do Tenant é obrigatório");
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException("Slug do Tenant é obrigatório");

        this.id = id;
        this.name = name.trim();
        this.slug = normalizeSlug(slug);
        this.active = active;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public static Tenant create(UUID id, String name, String slug) {
        return new Tenant(id != null ? id : UUID.randomUUID(), name, slug, true, Instant.now(), Instant.now());
    }

    public void update(String name, String slug, boolean active) {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("Nome do Tenant é obrigatório");
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException("Slug do Tenant é obrigatório");

        this.name = name.trim();
        this.slug = normalizeSlug(slug);
        this.active = active;
        this.updatedAt = Instant.now();
    }

    public static String normalizeSlug(String input) {
        if (input == null) return "";
        String nowhitespace = WHITESPACE.matcher(input.trim().toLowerCase(Locale.ROOT)).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.replaceAll("-+", "-").replaceAll("^-|-$", "");
    }
}

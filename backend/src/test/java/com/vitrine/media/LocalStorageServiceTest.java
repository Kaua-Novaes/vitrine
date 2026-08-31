package com.vitrine.media;

import com.vitrine.common.exception.BusinessException;
import com.vitrine.media.infra.LocalStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class LocalStorageServiceTest {

    private LocalStorageService storageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        storageService = new LocalStorageService(tempDir.toString());
    }

    @Test
    void shouldStoreFileSuccessfully() {
        UUID tenantId = UUID.randomUUID();
        byte[] content = "fake image content".getBytes(StandardCharsets.UTF_8);
        ByteArrayInputStream stream = new ByteArrayInputStream(content);

        String url = storageService.store(stream, "test.png", "image/png", content.length, tenantId, "products");

        assertNotNull(url);
        assertTrue(url.startsWith("/storage/tenants/" + tenantId + "/products/"));
        assertTrue(url.endsWith(".png"));
        assertTrue(storageService.exists(url, tenantId));
    }

    @Test
    void shouldRejectInvalidMimeType() {
        UUID tenantId = UUID.randomUUID();
        byte[] content = "malicious executable".getBytes(StandardCharsets.UTF_8);
        ByteArrayInputStream stream = new ByteArrayInputStream(content);

        assertThrows(BusinessException.class, () ->
                storageService.store(stream, "script.exe", "application/x-msdownload", content.length, tenantId, "products"));
    }

    @Test
    void shouldRejectFileExceedingMaxSize() {
        UUID tenantId = UUID.randomUUID();
        ByteArrayInputStream stream = new ByteArrayInputStream(new byte[1]);
        long oversized = 6 * 1024 * 1024; // 6MB

        assertThrows(BusinessException.class, () ->
                storageService.store(stream, "huge.jpg", "image/jpeg", oversized, tenantId, "products"));
    }

    @Test
    void shouldDeleteFileSuccessfully() {
        UUID tenantId = UUID.randomUUID();
        byte[] content = "image".getBytes(StandardCharsets.UTF_8);
        String url = storageService.store(new ByteArrayInputStream(content), "banner.jpg", "image/jpeg", content.length, tenantId, "banners");

        assertTrue(storageService.exists(url, tenantId));
        storageService.delete(url, tenantId);
        assertFalse(storageService.exists(url, tenantId));
    }

    @Test
    void shouldPreventCrossTenantDeletion() {
        UUID tenantA = UUID.randomUUID();
        UUID tenantB = UUID.randomUUID();
        byte[] content = "image".getBytes(StandardCharsets.UTF_8);

        String url = storageService.store(new ByteArrayInputStream(content), "photo.webp", "image/webp", content.length, tenantA, "products");

        assertThrows(BusinessException.class, () -> storageService.delete(url, tenantB));
    }
}

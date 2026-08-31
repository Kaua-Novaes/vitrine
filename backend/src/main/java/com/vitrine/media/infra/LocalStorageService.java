package com.vitrine.media.infra;

import com.vitrine.common.exception.BusinessException;
import com.vitrine.media.port.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path basePath;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/svg+xml"
    );
    private static final Set<String> ALLOWED_FOLDERS = Set.of(
            "logo",
            "banners",
            "categories",
            "products"
    );

    public LocalStorageService(@Value("${storage.local.base-dir:/storage/tenants}") String baseDir) {
        this.basePath = Paths.get(baseDir);
    }

    @Override
    public String store(InputStream inputStream, String originalFilename, String contentType, long size, UUID tenantId, String folder) {
        validateFile(contentType, size, folder);

        String sanitizedFolder = sanitizeFolder(folder);
        String extension = extractExtension(originalFilename, contentType);
        String uniqueFileName = UUID.randomUUID() + "." + extension;

        Path tenantFolder = basePath.resolve(tenantId.toString()).resolve(sanitizedFolder).normalize();

        try {
            if (!tenantFolder.startsWith(basePath)) {
                throw new BusinessException("Tentativa de Path Traversal detectada.");
            }
            Files.createDirectories(tenantFolder);
            Path destination = tenantFolder.resolve(uniqueFileName);

            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);

            return String.format("/storage/tenants/%s/%s/%s", tenantId, sanitizedFolder, uniqueFileName);
        } catch (IOException e) {
            throw new BusinessException("Falha ao salvar arquivo no storage local: " + e.getMessage());
        }
    }

    @Override
    public void delete(String fileUrl, UUID tenantId) {
        if (fileUrl == null || fileUrl.isBlank()) return;

        // Ensure URL starts with /storage/tenants/{tenantId}/
        String expectedPrefix = "/storage/tenants/" + tenantId + "/";
        if (!fileUrl.startsWith(expectedPrefix)) {
            throw new BusinessException("Acesso negado ou URL de arquivo inválida para este tenant.");
        }

        String relativePath = fileUrl.substring("/storage/tenants/".length());
        Path targetPath = basePath.resolve(relativePath).normalize();

        if (!targetPath.startsWith(basePath)) {
            throw new BusinessException("Tentativa de Path Traversal detectada.");
        }

        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            throw new BusinessException("Falha ao excluir arquivo do storage: " + e.getMessage());
        }
    }

    @Override
    public boolean exists(String fileUrl, UUID tenantId) {
        if (fileUrl == null || fileUrl.isBlank()) return false;
        String expectedPrefix = "/storage/tenants/" + tenantId + "/";
        if (!fileUrl.startsWith(expectedPrefix)) return false;

        String relativePath = fileUrl.substring("/storage/tenants/".length());
        Path targetPath = basePath.resolve(relativePath).normalize();
        return Files.exists(targetPath) && targetPath.startsWith(basePath);
    }

    private void validateFile(String contentType, long size, String folder) {
        if (size > MAX_FILE_SIZE) {
            throw new BusinessException("Arquivo excede o limite máximo permitido de 5MB.");
        }
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new BusinessException("Formato de imagem não suportado. Utilize JPEG, PNG, WebP ou SVG.");
        }
        if (folder != null && !ALLOWED_FOLDERS.contains(folder.toLowerCase())) {
            throw new BusinessException("Pasta de armazenamento inválida.");
        }
    }

    private String sanitizeFolder(String folder) {
        if (folder == null || folder.isBlank()) return "products";
        return folder.toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    private String extractExtension(String filename, String contentType) {
        if (filename != null && filename.contains(".")) {
            String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
            if (List.of("jpg", "jpeg", "png", "webp", "svg").contains(ext)) {
                return ext.equals("jpeg") ? "jpg" : ext;
            }
        }
        return switch (contentType != null ? contentType.toLowerCase() : "") {
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            case "image/svg+xml" -> "svg";
            default -> "jpg";
        };
    }
}

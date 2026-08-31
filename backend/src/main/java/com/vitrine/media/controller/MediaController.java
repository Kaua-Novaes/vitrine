package com.vitrine.media.controller;

import com.vitrine.common.exception.BusinessException;
import com.vitrine.media.dto.MediaUploadResponse;
import com.vitrine.media.port.StorageService;
import com.vitrine.tenant.context.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
public class MediaController {

    private final StorageService storageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MediaUploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "products") String folder) {

        if (file.isEmpty()) {
            throw new BusinessException("O arquivo enviado está vazio.");
        }

        UUID tenantId = TenantContext.requireTenantId();

        try {
            String fileUrl = storageService.store(
                    file.getInputStream(),
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getSize(),
                    tenantId,
                    folder
            );

            MediaUploadResponse response = MediaUploadResponse.builder()
                    .url(fileUrl)
                    .fileName(file.getOriginalFilename())
                    .size(file.getSize())
                    .mimeType(file.getContentType())
                    .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            throw new BusinessException("Erro ao processar stream do arquivo: " + e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestParam("url") String url) {
        UUID tenantId = TenantContext.requireTenantId();
        storageService.delete(url, tenantId);
        return ResponseEntity.noContent().build();
    }
}

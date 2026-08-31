package com.vitrine.media.port;

import java.io.InputStream;
import java.util.UUID;

public interface StorageService {
    String store(InputStream inputStream, String originalFilename, String contentType, long size, UUID tenantId, String folder);
    void delete(String fileUrl, UUID tenantId);
    boolean exists(String fileUrl, UUID tenantId);
}

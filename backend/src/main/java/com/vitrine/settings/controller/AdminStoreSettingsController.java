package com.vitrine.settings.controller;

import com.vitrine.settings.dto.StoreSettingsResponse;
import com.vitrine.settings.dto.UpdateStoreSettingsRequest;
import com.vitrine.settings.usecase.GetStoreSettingsUseCase;
import com.vitrine.settings.usecase.UpdateStoreSettingsUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class AdminStoreSettingsController {

    private final GetStoreSettingsUseCase getStoreSettingsUseCase;
    private final UpdateStoreSettingsUseCase updateStoreSettingsUseCase;

    @GetMapping
    public ResponseEntity<StoreSettingsResponse> getSettings() {
        return ResponseEntity.ok(getStoreSettingsUseCase.getAdminStoreSettings());
    }

    @PutMapping
    public ResponseEntity<StoreSettingsResponse> updateSettings(@Valid @RequestBody UpdateStoreSettingsRequest request) {
        return ResponseEntity.ok(updateStoreSettingsUseCase.execute(request));
    }
}

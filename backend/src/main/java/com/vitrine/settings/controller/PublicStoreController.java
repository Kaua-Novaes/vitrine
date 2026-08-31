package com.vitrine.settings.controller;

import com.vitrine.settings.dto.StorePublicResponse;
import com.vitrine.settings.usecase.GetStoreSettingsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/store")
@RequiredArgsConstructor
public class PublicStoreController {

    private final GetStoreSettingsUseCase getStoreSettingsUseCase;

    @GetMapping
    public ResponseEntity<StorePublicResponse> getStore() {
        return ResponseEntity.ok(getStoreSettingsUseCase.getPublicStore());
    }
}

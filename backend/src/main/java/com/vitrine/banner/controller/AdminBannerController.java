package com.vitrine.banner.controller;

import com.vitrine.banner.dto.BannerInput;
import com.vitrine.banner.dto.BannerResponse;
import com.vitrine.banner.usecase.CreateBannerUseCase;
import com.vitrine.banner.usecase.DeleteBannerUseCase;
import com.vitrine.banner.usecase.ListBannersUseCase;
import com.vitrine.banner.usecase.UpdateBannerUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {

    private final ListBannersUseCase listBannersUseCase;
    private final CreateBannerUseCase createBannerUseCase;
    private final UpdateBannerUseCase updateBannerUseCase;
    private final DeleteBannerUseCase deleteBannerUseCase;

    @GetMapping
    public ResponseEntity<List<BannerResponse>> listBanners() {
        return ResponseEntity.ok(listBannersUseCase.listAdminBanners());
    }

    @PostMapping
    public ResponseEntity<BannerResponse> createBanner(@Valid @RequestBody BannerInput input) {
        BannerResponse response = createBannerUseCase.execute(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BannerResponse> updateBanner(
            @PathVariable("id") UUID id,
            @Valid @RequestBody BannerInput input) {
        return ResponseEntity.ok(updateBannerUseCase.execute(id, input));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable("id") UUID id) {
        deleteBannerUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}

package com.vitrine.banner.controller;

import com.vitrine.banner.dto.BannerResponse;
import com.vitrine.banner.usecase.ListBannersUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/banners")
@RequiredArgsConstructor
public class PublicBannerController {

    private final ListBannersUseCase listBannersUseCase;

    @GetMapping
    public ResponseEntity<List<BannerResponse>> listBanners() {
        List<BannerResponse> banners = listBannersUseCase.listPublicActiveBanners();
        return ResponseEntity.ok(banners);
    }
}

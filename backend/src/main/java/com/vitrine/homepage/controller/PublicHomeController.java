package com.vitrine.homepage.controller;

import com.vitrine.homepage.dto.HomeSectionsResponse;
import com.vitrine.homepage.usecase.GetPublicHomeCompositionUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/home")
@RequiredArgsConstructor
public class PublicHomeController {

    private final GetPublicHomeCompositionUseCase getPublicHomeCompositionUseCase;

    @GetMapping
    public ResponseEntity<HomeSectionsResponse> getHome() {
        return ResponseEntity.ok(getPublicHomeCompositionUseCase.execute());
    }
}

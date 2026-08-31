package com.vitrine.product.controller;

import com.vitrine.common.dto.PageResponse;
import com.vitrine.product.dto.ProductDetailResponse;
import com.vitrine.product.dto.ProductSummaryResponse;
import com.vitrine.product.usecase.GetProductUseCase;
import com.vitrine.product.usecase.ListProductsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/products")
@RequiredArgsConstructor
public class PublicProductController {

    private final ListProductsUseCase listProductsUseCase;
    private final GetProductUseCase getProductUseCase;

    @GetMapping
    public ResponseEntity<PageResponse<ProductSummaryResponse>> listPublicProducts(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "categorySlug", required = false) String categorySlug,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        PageResponse<ProductSummaryResponse> response = listProductsUseCase.listPublicProducts(
                query,
                categorySlug,
                PageRequest.of(page, size, Sort.by("displayOrder").ascending())
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductDetailResponse> getProductBySlug(@PathVariable("slug") String slug) {
        ProductDetailResponse response = getProductUseCase.getBySlug(slug);
        return ResponseEntity.ok(response);
    }
}

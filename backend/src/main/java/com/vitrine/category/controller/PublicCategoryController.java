package com.vitrine.category.controller;

import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.usecase.GetCategoryUseCase;
import com.vitrine.category.usecase.ListCategoriesUseCase;
import com.vitrine.common.dto.PageResponse;
import com.vitrine.product.dto.ProductSummaryResponse;
import com.vitrine.product.usecase.ListProductsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final ListCategoriesUseCase listCategoriesUseCase;
    private final GetCategoryUseCase getCategoryUseCase;
    private final ListProductsUseCase listProductsUseCase;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> listActiveCategories() {
        List<CategoryResponse> categories = listCategoriesUseCase.listPublicActiveCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CategoryResponse> getCategoryBySlug(@PathVariable("slug") String slug) {
        CategoryResponse category = getCategoryUseCase.getBySlug(slug);
        return ResponseEntity.ok(category);
    }

    @GetMapping("/{slug}/products")
    public ResponseEntity<PageResponse<ProductSummaryResponse>> getCategoryProducts(
            @PathVariable("slug") String slug,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        PageResponse<ProductSummaryResponse> response = listProductsUseCase.listPublicProducts(
                null,
                slug,
                PageRequest.of(page, size, Sort.by("displayOrder").ascending())
        );
        return ResponseEntity.ok(response);
    }
}

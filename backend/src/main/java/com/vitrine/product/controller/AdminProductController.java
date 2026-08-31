package com.vitrine.product.controller;

import com.vitrine.common.dto.PageResponse;
import com.vitrine.product.dto.ProductDetailResponse;
import com.vitrine.product.dto.ProductInput;
import com.vitrine.product.dto.ProductSummaryResponse;
import com.vitrine.product.usecase.CreateProductUseCase;
import com.vitrine.product.usecase.DeleteProductUseCase;
import com.vitrine.product.usecase.GetProductUseCase;
import com.vitrine.product.usecase.ListProductsUseCase;
import com.vitrine.product.usecase.UpdateProductUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ListProductsUseCase listProductsUseCase;
    private final GetProductUseCase getProductUseCase;
    private final CreateProductUseCase createProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final DeleteProductUseCase deleteProductUseCase;

    @GetMapping
    public ResponseEntity<PageResponse<ProductSummaryResponse>> listProducts(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {
        PageResponse<ProductSummaryResponse> response = listProductsUseCase.listAdminProducts(
                search,
                PageRequest.of(page, size, Sort.by("displayOrder").ascending())
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ProductDetailResponse> createProduct(@Valid @RequestBody ProductInput input) {
        ProductDetailResponse response = createProductUseCase.execute(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProduct(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(getProductUseCase.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> updateProduct(
            @PathVariable("id") UUID id,
            @Valid @RequestBody ProductInput input) {
        return ResponseEntity.ok(updateProductUseCase.execute(id, input));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") UUID id) {
        deleteProductUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}

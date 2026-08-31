package com.vitrine.category.controller;

import com.vitrine.category.dto.CategoryInput;
import com.vitrine.category.dto.CategoryResponse;
import com.vitrine.category.usecase.CreateCategoryUseCase;
import com.vitrine.category.usecase.DeleteCategoryUseCase;
import com.vitrine.category.usecase.GetCategoryUseCase;
import com.vitrine.category.usecase.ListCategoriesUseCase;
import com.vitrine.category.usecase.UpdateCategoryUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final ListCategoriesUseCase listCategoriesUseCase;
    private final GetCategoryUseCase getCategoryUseCase;
    private final CreateCategoryUseCase createCategoryUseCase;
    private final UpdateCategoryUseCase updateCategoryUseCase;
    private final DeleteCategoryUseCase deleteCategoryUseCase;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> listCategories() {
        return ResponseEntity.ok(listCategoriesUseCase.listAdminCategories());
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryInput input) {
        CategoryResponse response = createCategoryUseCase.execute(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategory(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(getCategoryUseCase.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable("id") UUID id,
            @Valid @RequestBody CategoryInput input) {
        return ResponseEntity.ok(updateCategoryUseCase.execute(id, input));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") UUID id) {
        deleteCategoryUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}

package com.vitrine.testimonial.controller;

import com.vitrine.testimonial.dto.TestimonialInput;
import com.vitrine.testimonial.dto.TestimonialResponse;
import com.vitrine.testimonial.usecase.CreateTestimonialUseCase;
import com.vitrine.testimonial.usecase.DeleteTestimonialUseCase;
import com.vitrine.testimonial.usecase.ListTestimonialsUseCase;
import com.vitrine.testimonial.usecase.UpdateTestimonialUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/testimonials")
@RequiredArgsConstructor
public class AdminTestimonialController {

    private final ListTestimonialsUseCase listTestimonialsUseCase;
    private final CreateTestimonialUseCase createTestimonialUseCase;
    private final UpdateTestimonialUseCase updateTestimonialUseCase;
    private final DeleteTestimonialUseCase deleteTestimonialUseCase;

    @GetMapping
    public ResponseEntity<List<TestimonialResponse>> listTestimonials() {
        return ResponseEntity.ok(listTestimonialsUseCase.listAdminTestimonials());
    }

    @PostMapping
    public ResponseEntity<TestimonialResponse> createTestimonial(@Valid @RequestBody TestimonialInput input) {
        TestimonialResponse response = createTestimonialUseCase.execute(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestimonialResponse> updateTestimonial(
            @PathVariable("id") UUID id,
            @Valid @RequestBody TestimonialInput input) {
        return ResponseEntity.ok(updateTestimonialUseCase.execute(id, input));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable("id") UUID id) {
        deleteTestimonialUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}

package com.vitrine.testimonial.controller;

import com.vitrine.testimonial.dto.TestimonialResponse;
import com.vitrine.testimonial.usecase.ListTestimonialsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/testimonials")
@RequiredArgsConstructor
public class PublicTestimonialController {

    private final ListTestimonialsUseCase listTestimonialsUseCase;

    @GetMapping
    public ResponseEntity<List<TestimonialResponse>> listTestimonials() {
        List<TestimonialResponse> response = listTestimonialsUseCase.listPublicActiveTestimonials();
        return ResponseEntity.ok(response);
    }
}

package com.vitrine.testimonial.dto;

import com.vitrine.testimonial.domain.Testimonial;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestimonialResponse {
    private UUID id;
    private String name;
    private String text;
    private int displayOrder;
    private boolean active;

    public static TestimonialResponse fromDomain(Testimonial testimonial) {
        return TestimonialResponse.builder()
                .id(testimonial.getId())
                .name(testimonial.getName())
                .text(testimonial.getText())
                .displayOrder(testimonial.getDisplayOrder())
                .active(testimonial.isActive())
                .build();
    }
}
